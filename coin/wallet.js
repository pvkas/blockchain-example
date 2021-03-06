const crypto = require("crypto");
const Chain = require("./chain");
const Transaction = require("./transaction");

class Wallet {
  constructor() {
    // new wallet with it's unique private and public key
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    this.id = crypto.randomBytes(16).toString("hex");
    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  sendMoney(amount, payeePublicKey) {
    // create transaction from wallet
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

    // sign the trasaction with sender's private key
    const sign = crypto.createSign("SHA256");
    sign.update(transaction.toString()).end();
    const signature = sign.sign(this.privateKey);

    // broadcast the transaction to the network
    Chain.instance.addTransaction(transaction, this.publicKey, signature);
  }
}

module.exports = Wallet;
