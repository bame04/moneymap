import { BankStatement, Transaction } from '@/types/statement'

export function parseStatementData(text: string): BankStatement {
  // Extract basic info
  const accountHolder = text.match(/MR (.+)/)?.[1] || ''
  const accountNumber = text.match(/(\d{11})/)?.[1] || ''
  
  // Extract statement period
  const periodMatch = text.match(/Statement Period : (.+) to (.+)/)
  const statementPeriod = {
    from: periodMatch?.[1] || '',
    to: periodMatch?.[2] || ''
  }

  // Extract balances
  const openingBalance = parseFloat(text.match(/Opening Balance (\d+\.\d+)/)?.[1] || '0')
  const closingBalance = parseFloat(text.match(/Closing Balance (\d+\.\d+)/)?.[1] || '0')

  // Extract bank charges
  const bankCharges = {
    'Total VAT': parseFloat(text.match(/Total VAT\s+(\d+\.\d+)/)?.[1] || '0'),
    'Other Fees': parseFloat(text.match(/Other Fees\s+(\d+\.\d+)/)?.[1] || '0'),
    'Dr Bank Charges Service Fees': parseFloat(text.match(/Service Fees\s+(\d+\.\d+)/)?.[1] || '0')
  }

  // Parse transactions
  const transactions: Transaction[] = []
  const transactionLines = text.split('\n')
  
  transactionLines.forEach(line => {
    // Updated regex to match your actual statement format
    const match = line.match(/(\d{2} [A-Za-z]{3} \d{4})\s+(.+?)\s+(\d+\.\d{2})\s+(\d+\.\d{2})/)
    if (match) {
      const description = match[2].trim()
      const amount = match[3]
      
      // Determine transaction type based on description
      // In your case, most transactions are debits (money going out)
      const type = description.toLowerCase().includes('credit') ? 'credit' : 'credit'
      
      transactions.push({
        date: match[1], // Now includes year
        description: description,
        amount: amount,
        balance: match[4],
        type: type
      })
    }
  })

  // Create the statement object with the updated structure
  return {
    id: '', // This will be set by Supabase
    user_id: '', // This will be set when uploading
    account_holder: accountHolder,
    account_number: accountNumber,
    statement_period: statementPeriod,
    opening_balance: openingBalance,
    closing_balance: closingBalance,
    vat_amount: bankCharges['Total VAT'],
    bank_charges: bankCharges,
    transactions: transactions,
    pdf_url: null,
    created_at: new Date().toISOString(),
    content: null,
    filename: '',
    uploaded_at: new Date().toISOString()
  }
}