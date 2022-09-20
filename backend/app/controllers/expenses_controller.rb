class ExpensesController < ApplicationController
  rescue_from ActiveRecord::RecordInvalid do |error|
    expense = error.record
    render json: expense.errors, status: :bad_request
  end

  def index
    render json: Expense.order(date: :desc)
  end

  def show
    expense = Expense.find(params[:id])
    render json: expense
  end

  def create
    expense = Expense.new(expense_params)

    ActiveRecord::Base.transaction do
      expense.save!
      BalanceTracker::CreateExpense.call(expense)
    end

    render json: expense
  end

  def update
    expense = Expense.find(params[:id])

    ActiveRecord::Base.transaction do
      BalanceTracker::UpdateExpense.call(expense, expense_params)
      expense.update!(expense_params)
    end

    render json: expense
  end

  def destroy
    expense = Expense.find(params[:id])

    ActiveRecord::Base.transaction do
      BalanceTracker::DeleteExpense.call(expense)
      expense.destroy
    end
  end

  private

  def expense_params
    params.permit(:amount, :date, :description, :account_id)
  end
end
