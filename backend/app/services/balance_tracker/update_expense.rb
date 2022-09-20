class BalanceTracker::UpdateExpense
  attr_reader :expense, :params

  def initialize(expense, params)
    @expense = expense
    @params = params
  end

  def self.call(expense, params)
    new(expense, params).perform
  end

  def perform
    if (old_account.id != new_account.id)
      old_account.update!(balance: old_account.balance + expense.amount)
      new_account.update!(balance: new_account.balance - new_amount)
    else
      old_account.update!(balance: old_account.balance + expense.amount - new_amount)
    end
  end

  private

  def old_account
    @old_account ||= expense.account
  end

  def new_account
    @new_account ||= Account.find(params[:account_id])
  end

  def new_amount
    @new_amount ||= params[:amount].to_i
  end
end
