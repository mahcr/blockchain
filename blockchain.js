const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(data) {
    this.index = 0;
    this.data = data;
    this.previousHash = '';
    this.timestamp = Date.now();
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index + JSON.stringify(this.data) +
      this.previousHash +
      this.timestamp +
      this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    console.log('Mining...');
    while (this.hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined:' + this.hash);
  }

}


class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
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
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isValidChain() {
    return BlockChain.validateChain(this.chain, this.difficulty);
  }


  /**
   * Las validaciones para que block chain sea seguro
   * - Que el hash sea valido
   * - El index sea consecutivo
   * - Que el previos calce con el actual
   */
  static validateChain(chain, pow) {
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

      if (actual.hash.substring(0, pow) !== '0'.repeat(pow)) {
        return null;
      }

      return actual;
    });
  }

}

/**
 * Si cambia un chain, lo puede recalcular y que vuelva a ser calida
 */
hackBlockchain = (chain)=>{

    chain.forEach((currentBlock)=>{
      if( currentBlock.index > 0){
        const previousBlock = chain[currentBlock.index - 1];

            if (currentBlock.previousHash !== previousBlock.hash) {
                currentBlock.previousHash = previousBlock.hash;
            }
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
              currentBlock.hash = currentBlock.calculateHash();
          }
    })
  }

// let academy = new BlockChain;

// let block1 = new Block({ from: 'Mariano', amount: 100 });
// console.log(block1);

// let block2 = new Block({ from: 'Manuel', amount: 100 });
// console.log(block1);

// academy.addNewBlock(block2);
// academy.addNewBlock(block1);

// console.log(academy.chain);

module.exports = { Block, BlockChain };
