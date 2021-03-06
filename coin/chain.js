const crypto = require("crypto");
const Block = require("./block");
const Transaction = require("./transaction");

class Chain {
  static instance = new Chain();

  constructor() {
    this.chain = [
      // Genesis block
      new Block("", [new Transaction(100, "genesis", "satoshi")], 4),
    ];
  }

  // Most recent block
  get lastBlock() {
    // returns
    return this.chain[this.chain.length - 1];
  }

  // Proof of work system
  mine(block) {
    console.log("⛏  Mining...");

    // initial noonce
    let nonce = 0;

    // extract current block info
    const { difficulty } = block;

    // validate all transactions
    // Add first transaction as reward to you (ex, [reward, ...validTransactions])
    const validTransactions = block.transactions;

    // Find out noonce
    while (true) {
      // get hash for current nonce
      const hash = Block.Hash(this.lastBlock.hash, block.hash, nonce, difficulty);
      console.log("Nonce", nonce, hash);

      // check hash is correct
      if (hash.substr(0, difficulty) === "0".repeat(difficulty)) {
        console.log(`🎉 Solved: ${hash}`);

        // return new mined block and broad cast to others
        return new Block(this.lastBlock.hash, validTransactions, difficulty, block.ts, nonce);
      }

      // did not work, increase noonce
      nonce += 1;
    }
  }

  // Add a new block to the chain if valid signature & proof of work is complete
  addTransaction(transaction, senderPublicKey, signature) {
    console.log("💸 Received new transaction");

    // verify transaction signature
    console.log("🧾 Verifying transaction singature");
    const verify = crypto.createVerify("SHA256");
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPublicKey, signature);
    console.log(`${isValid ? `✅ Transaction is valid` : `❌ Transaction is not valid`}`);

    if (isValid) {
      // generate block with transactions
      const newBlock = new Block(this.lastBlock.hash, [transaction], this.lastBlock.difficulty);

      // broadcast block for mining
      const minedBlock = this.mine(newBlock);
      console.log("🧱 Mined new block");

      // broadcast block for validity
      // if node validates add to the chain & broadcast to other nodes to add this block to their chain
      console.log("⛓  Adding mined block to the chain");
      this.chain.push(minedBlock);
    }

    // broadcast as invalid transaction / do not add to block
  }
}

module.exports = Chain;
