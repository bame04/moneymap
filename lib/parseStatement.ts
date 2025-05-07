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

  // Parse transactions
  const transactions: Transaction[] = []
  const transactionLines = text.split('\n')
  
  transactionLines.forEach(line => {
    const match = line.match(/(\d{2} [A-Za-z]{3})\s+(.+?)\s+(\d+\.\d{2})(Cr|Dr)?\s+(\d+\.\d{2})(Cr|Dr)?/)
    if (match) {
      transactions.push({
        date: match[1],
        description: match[2].trim(),
        amount: match[3],
        balance: match[5],
        type: match[4]?.toLowerCase() === 'dr' ? 'debit' : 'credit'
      })
    }
  })

  return {
    accountHolder,
    accountNumber,
    statementPeriod,
    openingBalance,
    closingBalance,
    vatAmount: 0, // Parse from statement
    bankCharges: {
      serviceFees: 0,
      cashDepositFees: 0,
      cashHandlingFees: 0,
      otherFees: 0
    },
    transactions
  }
}