export interface Transaction {
  date: string
  description: string
  amount: string
  balance: string
  bankCharges?: string
  type: 'credit' | 'debit'
}

export interface BankStatement {
  accountHolder: string
  accountNumber: string
  statementPeriod: {
    from: string
    to: string
  }
  openingBalance: number
  closingBalance: number
  vatAmount: number
  bankCharges: {
    serviceFees: number
    cashDepositFees: number
    cashHandlingFees: number
    otherFees: number
  }
  transactions: Transaction[]
}