export interface Transaction {
  date: string
  description: string
  amount: string
  balance: string
  type: 'credit' | 'debit'
}

export interface BankStatement {
  id: string
  user_id: string
  account_holder: string
  account_number: string
  statement_period: {
    from: string
    to: string
  }
  opening_balance: number
  closing_balance: number
  vat_amount: number
  bank_charges: {
    'Total VAT': number
    'Other Fees': number
    'Dr Bank Charges Service Fees': number
  }
  transactions: Transaction[]
  pdf_url: string | null
  created_at: string
  content: string | null
  filename: string
  uploaded_at: string
}