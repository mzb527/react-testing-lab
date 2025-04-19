import React from "react";

function AddTransactionForm({ postTransaction }) {
  function submitForm(e) {
    e.preventDefault();

    const form = e.target;
    const dateInput = form.querySelector('input[name="date"]');
    const descriptionInput = form.querySelector('input[name="description"]');
    const categoryInput = form.querySelector('input[name="category"]');
    const amountInput = form.querySelector('input[name="amount"]');

    if (dateInput && descriptionInput && categoryInput && amountInput) {
      const newTransaction = {
        date: dateInput.value,
        description: descriptionInput.value,
        category: categoryInput.value,
        amount: amountInput.value
      };
      postTransaction(newTransaction);
    }
  }

  return (
    <div className="ui segment">
      <form className="ui form" onSubmit={submitForm}>
        <div className="inline fields">
          <input type="date" name="date" data-testid="date-input" />
          <input type="text" name="description" placeholder="Description" />
          <input type="text" name="category" placeholder="Category" />
          <input type="number" name="amount" placeholder="Amount" step="0.01" />
        </div>
        <button className="ui button" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;