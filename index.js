// Emulate the Currency Transaction
const Wallet = require("./coin/wallet");

// Create two wallet
const satoshi = new Wallet();
const vikas = new Wallet();

// Send money from one wallet to another
satoshi.sendMoney(50, vikas.publicKey);
