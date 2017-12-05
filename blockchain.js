const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(data) {
    this.index = 0;
    this.data = '';
    this.previousHash = '';
    this.timestamp = Date.now();
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index + JSON.stringify(this.data) +
      this.previousHash +
      this.timestamp
    ).toString();
  }
}


class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block({ from: '', amount: '1000' });
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addNewBlock(newBlock) {
    let previousBlock = this.getLatestBlock();
    newBlock.index = previousBlock.index + 1;
    newBlock.previousHash = previousBlock.hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isValidChain() {
    return BlockChain.validateChain(this.chain);
  }


  /**
   * Las validaciones para que block chain sea seguro
   * - Que el hash sea valido
   * - El index sea consecutivo
   * - Que el previos calce con el actual
   */
  static validateChain(chain) {
    chain.reduce((previous, actual) => {
      if (!previous) return null;
      if (previous.index !== actual.index - 1 ) {
        return null;
      }

      if (previous.hash !== actual.previousHash) {
        return null;
      }

      if (actual.hash !== actual.calculateHash()) {
        return null;
      }

      return actual;

    });
  }

}

let academy = new BlockChain;

let block1 = new Block({ from: 'Mariano', amount: 100 });
console.log(block1);

let block2 = new Block({ from: 'Manuel', amount: 100 });
console.log(block1);

academy.addNewBlock(block2);
academy.addNewBlock(block1);

console.log(academy.chain);
