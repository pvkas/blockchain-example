const crypto = require("crypto");

class Block {
  // Static method to generate hash for block
  static Hash(prevHash, content, nonce, difficulty) {
    const hash = crypto.createHash("SHA256");
    hash.update(`${prevHash}${content}${nonce}${difficulty}`).end();
    return hash.digest("hex");
  }

  constructor(prevHash, transactions, difficulty, ts = Date.now(), noonce = "") {
    this.prevHash = prevHash;
    this.transactions = transactions;
    this.ts = ts;
    this.difficulty = difficulty;
    this.noonce = noonce;
  }

  // content used in hash
  get content() {
    return JSON.stringify({
      transactions: this.transactions,
      ts: this.ts,
    });
  }

  // gives hash of current block
  get hash() {
    return Block.Hash(this.prevHash, this.content, this.noonce, this.difficulty);
  }
}

module.exports = Block;
