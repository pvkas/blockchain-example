class Transaction {
  constructor(amount, payer, payee) {
    this.amount = amount;
    this.payer = payer;
    this.payee = payee;
  }

  toString() {
    return JSON.stringify(this);
  }
}

module.exports = Transaction;
