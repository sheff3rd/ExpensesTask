class BalanceTracker::CreateExpense
  attr_reader :expense, :amount, :account

  def initialize(expense)
    @expense = expense
    @amount = expense.amount
    @account = expense.account
  end

  def self.call(expense)
    new(expense).perform
  end

  def perform
    account.update!(balance: account.balance - amount)
  end
end
