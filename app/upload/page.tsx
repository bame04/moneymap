'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supautil';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Transaction } from '@/types/statement';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js ';

// --- Parsing Helpers ---
const extractField = (text: string, pattern: RegExp): string => {
  const m = text.match(pattern);
  return m ? m[1].trim() : '';
};

const extractStatementPeriod = (text: string): { from: string; to: string } => {
  const m = text.match(/Statement Period:\s*(\d{1,2} [A-Za-z]{3} \d{4})\s+to\s+(\d{1,2} [A-Za-z]{3} \d{4})/i);
  if (m) {
    return { from: m[1], to: m[2] };
  }
  return { from: '', to: '' };
};

const extractBalances = (text: string): { opening: number; closing: number } => {
  const openingMatch = text.match(/Opening Balance\s*([\d,]+\.\d{2})\s*Cr/i);
  const closingMatch = text.match(/Closing Balance\s*([\d,]+\.\d{2})\s*Cr/i);
  return {
    opening: openingMatch ? parseFloat(openingMatch[1].replace(/,/g, '')) : 0,
    closing: closingMatch ? parseFloat(closingMatch[1].replace(/,/g, '')) : 0,
  };
};

const extractCharges = (text: string): Record<string, number> => {
  const charges: Record<string, number> = {};
  const regex = /(?:#)?([A-Za-z ]+(?:Fee|Fees))\s+([\d,]+\.\d{2})\s+(?:Dr|Cr)/gi;
  let match;
  while ((match = regex.exec(text))) {
    const key = match[1].trim();
    charges[key] = parseFloat(match[2].replace(/,/g, ''));
  }

  // VAT amount
  const vatMatch = text.match(/Inclusive of VAT@\s*\d+\.?\d*%\s*([\d,]+\.\d{2})\s*Dr/i);
  charges['Total VAT'] = vatMatch ? parseFloat(vatMatch[1].replace(/,/g, '')) : 0;

  return charges;
};

const extractTransactions = (
  text: string,
  period: { from: string; to: string },
  bankCharges: Record<string, number>
): Transaction[] => {
  const txs: Transaction[] = [];

  const year = period.to.split(' ').pop() || '2025';

  // Known fee patterns to exclude
  const feePatterns = [
    /#?Monthly Account Fee/i,
    /#?Service Fees?/i,
    /#?Unpaid Item Charge/i,
    /#?Honouring Fee/i,
    /#?Penalty Interest/i,
    /#?Int On Debit Balance/i,
    /#?Bank Charges/i,
    /#?Dr  Bank Charges/i,
    ...Object.keys(bankCharges).map(k => new RegExp(k, 'i')),
  ];

  // Match full transaction lines (Date|Description|Amount|Balance)
  const txRegex = /(\d{1,2} [A-Za-z]{3})+([\w\W]*?)(-?\d{1,3}(?:,\d{3})*\.\d{2})\s+(-?\d{1,3}(?:,\d{3})*\.\d{2})(?:\s+[\d\.\s]+)?/g;

  let match;
  while ((match = txRegex.exec(text)) !== null) {
    const [, rawDate, descriptionRaw, amountRaw, balanceRaw] = match;

    // Extract all dates and take the last one
    const dateMatches = rawDate.match(/\d{1,2} [A-Za-z]{3}/g);
    const date = dateMatches?.[dateMatches.length - 1] + ' ' + year;

    const description = descriptionRaw.trim();
    const amount = parseFloat(amountRaw.replace(/,/g, ''));
    const balance = parseFloat(balanceRaw.replace(/,/g, ''));

    // Skip known fee patterns
    if (feePatterns.some((re) => re.test(description))) continue;

    txs.push({
      date: date || '',
      description,
      amount: amount.toFixed(2),
      balance: balance.toFixed(2),
      type: amount >= 0 ? 'credit' : 'debit',
    });
  }

  return txs;
};

// --- Component ---
const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setError(null);
    if (f && ['application/pdf', 'text/plain', 'text/csv'].includes(f.type)) setFile(f);
    else toast.error('Select a PDF, TXT, or CSV file');
  };

  const onUpload = async () => {
    if (!file) return toast.error('No file selected');
    setUploading(true);
    setProgress(10);

    const { data: { session }, error: authErr } = await supabase.auth.getSession();
    if (authErr || !session) {
      setError('Authentication failed');
      setUploading(false);
      return;
    }
    setProgress(20);

    let text = '';
    if (file.type === 'application/pdf') {
      const buf = await file.arrayBuffer();
      setProgress(30);
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
        setProgress(30 + Math.floor((i / pdf.numPages) * 40));
      }
    } else {
      text = await file.text();
      setProgress(70);
    }

    const period = extractStatementPeriod(text);
    const { opening, closing } = extractBalances(text);
    const charges = extractCharges(text);
    const txs = extractTransactions(text, period, charges);

    const { error: dbErr } = await supabase.from('statements').insert({
      user_id: session.user.id,
      account_holder: extractField(text, /MR\s+([A-Za-z ]+)/i),
      account_number: extractField(text, /(\d{9,})/),
      statement_period: JSON.stringify(period),
      opening_balance: opening,
      closing_balance: closing,
      vat_amount: charges['Total VAT'] || 0,
      bank_charges: charges,
      transactions: JSON.stringify(txs),
      filename: file.name,
      uploaded_at: new Date().toISOString(),
    });

    if (dbErr) {
      setError(dbErr.message);
    } else {
      toast.success('Statement uploaded successfully!');
      router.push('/dashboard');
    }

    setProgress(100);
    setUploading(false);
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>Upload Statement</CardTitle>
        <CardDescription>PDF, TXT, or CSV only</CardDescription>
      </CardHeader>
      <CardContent>
        <input type="file" accept=".pdf,.txt,.csv" hidden ref={fileRef} onChange={onSelect} />
        <div className="flex gap-2 mb-4">
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {file ? 'Change File' : 'Select File'}
          </Button>
          {file && <span>{file.name}</span>}
        </div>
        {uploading && <Progress value={progress} className="mb-4" />}
        <Button onClick={onUpload} disabled={!file || uploading} className="w-full">
          {uploading ? `Processing ${progress}%` : 'Upload'}
        </Button>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadPage;