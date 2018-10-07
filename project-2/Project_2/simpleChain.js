/* =============== SHA256 with Crypto-js ====================|
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

/* =============== using levelSandbox.js ====================|
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const {
  addLevelDBData,
  getLevelDBData,
  getCompleteBlocksDBData,
  addDataToLevelDB
} = require('./levelSandbox.js');
const { Block } = require('./block');

const SHA256 = require('crypto-js/sha256');


/* =============== Blockchain Class ================|
|  Class with a constructor for new blockchain      |
|  ================================================*/
class Blockchain{


  /* ============================== constructor =================================|
  |  - Constructor, If there is no Block, then It adds the Genesis Block         | 
  |  ===========================================================================*/
  constructor() {

    var self = this;
    this.getBlockHeight()
    .then(function(data) {
      if(data == 0) {            
        self.addBlock(new Block("First block in the chain - Genesis block"))
        .then(function() {

        })
        .catch(function(err) {
          console.log(err);
        })
      }
    })
  }


  /* =============================== comments ===================================|
  |  - A Method that can be used as an utility while showing the console.log()   | 
  |  ===========================================================================*/
  comments() {
    return "||" + "=".repeat(20) + " {0} " + "=".repeat(20) + "||";
  }



  /* =============================== addBlock ===================================|
  |  - Add block to the Blockchain                                               | 
  |  ===========================================================================*/
  addBlock(newBlock){

    var self = this;
    return new Promise(function(resolve, reject) {
      console.log(newBlock);
      if(typeof newBlock === 'object') { 
        getCompleteBlocksDBData().then(function(data) {
          console.log("addBlock entered: ", data);
            // Block height
            if(typeof newBlock === 'object') {
              newBlock.height = data.length;
            // UTC timestamp
            newBlock.time = new Date().getTime().toString().slice(0,-3);
            // previous block hash
            if(data.length > 0){
              newBlock.previousBlockHash = JSON.parse(data[data.length-1].value).hash;
            }
            else {
              /*var welcome_message = "Welcome to your private Blockchain";
              var genesis_message = "your genesis Block is created. EJY"
              console.log(self.comments().replace("{0}", "=".repeat(welcome_message.length)));
              console.log(self.comments().replace("{0}", welcome_message));
              console.log(self.comments().replace("{0}", genesis_message));
              console.log(self.comments().replace("{0}", "=".repeat(welcome_message.length))); */
            }
            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            console.log("IMPORTANT: newBlock structure", JSON.stringify(newBlock));
            // Adding block object to chain
            addDataToLevelDB(JSON.stringify(newBlock))
            .then(function(result)  {
              if(JSON.parse(result).height == 0) {
                var welcome_message = "Welcome to your private Blockchain";
                var genesis_message = "your genesis Block is created. EJY";
                console.log(self.comments().replace("{0}", "=".repeat(welcome_message.length)));
                console.log(self.comments().replace("{0}", welcome_message));
                console.log(self.comments().replace("{0}", genesis_message));
                console.log(self.comments().replace("{0}", "=".repeat(welcome_message.length)));
              }
              else {
                var welcome_message = "Your Block is Successfully Added";
                console.log(self.comments().replace("{0}", "=".repeat(welcome_message.length)));
                console.log(self.comments().replace("{0}", welcome_message));
                console.log(self.comments().replace("{0}", "=".repeat(welcome_message.length)));
              }
              console.log("addBlock resolved");
              return resolve(result);
            });              
          }
          else {
            return reject();
          }        
        })
      }
      else {
        var error = "It is not a Block object. Please enter a Block. example: obj.addBlock(new Block('My First Block'))";
        console.log(error)
        return reject(error);
      }

    });
  }


    /* ============================ getBlockHeight ================================|
    |  - Get the block height of the Blockchain                                    | 
    |  ===========================================================================*/
    getBlockHeight()
    {
      var self = this;
      return getCompleteBlocksDBData().then(function(data) {
       var blockchain_height = "Your Blockchain height is: " + (data ? data.length : -1);
       console.log(self.comments().replace("{0}", "=".repeat(blockchain_height.length)));
       console.log(self.comments().replace("{0}", blockchain_height));
       console.log(self.comments().replace("{0}", "=".repeat(blockchain_height.length)));

        return data ? data.length : -1;
      })
    }


    /* ============================ printBlockChain ================================|
    |  - Prints the BlockChain                                                      | 
    |  ============================================================================*/
    printBlockChain()
    {
      var self = this;
      return getCompleteBlocksDBData().then(function(data) {
        var printBlockChain_msg = "This is your Blockchain"; 
       console.log(self.comments().replace("{0}", "=".repeat(printBlockChain_msg.length)));
       console.log(self.comments().replace("{0}", printBlockChain_msg));
       console.log("       ");
       for(var i = 0; i < data.length; i++) {
        console.log("#Block Number: ", i);
        console.log(data[i]);
        console.log("       ");
       }
       console.log(self.comments().replace("{0}", "=".repeat(printBlockChain_msg.length)));
       console.log("       ");
       return (data);
      })
    }    


    /* ============================ validateBlock =================================|
    |  - Validate the block, if it's created correctly                             | 
    |  ===========================================================================*/ 
    getBlock(blockHeight){
      var self = this;
      return getLevelDBData(blockHeight).then(function(data) {
       var getBlock_msg = "Your Block is: " + data;
       //console.log("=".repeat(10));
       console.log(self.comments().replace("{0}", getBlock_msg));
       //console.log("=".repeat(10));

        return data;
      });
    }


    /* ============================ validateBlock =================================|
    |  - Validate the block, if it's created correctly                             | 
    |  ===========================================================================*/
    validateBlock(blockHeight){
      var self = this;
      return new Promise(function(resolve, reject) {
        getCompleteBlocksDBData().then(function(data) {
            // get block object
            let block = JSON.parse(data[blockHeight].value); 
            // get block hash
            let blockHash = block.hash;
            // remove block hash to test block integrity
            block.hash = '';
            // generate block hash
            let validBlockHash = SHA256(JSON.stringify(block)).toString();
            // Compare
            console.log("validBlockHash : ", validBlockHash);
            console.log("blockHash      : ", blockHash);
            if (blockHash === validBlockHash) {
              var valid_message = "Your Block is Valid";
              console.log(self.comments().replace("{0}", "=".repeat(valid_message.length)));
              console.log(self.comments().replace("{0}", valid_message));
              console.log(self.comments().replace("{0}", "=".repeat(valid_message.length)));                 
             return resolve(true);
           } else {
            console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
            return reject(false);
          }
        })
      })
    }


    /* ======================= validateBlockConnection ============================|
    |  - Validate the connection of one particular block in chain                  |
    |  - It first validate the Block, the check the connection                     |    
    |  ===========================================================================*/
    validateBlockConnection(height) {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.validateBlock(height).then(function(result) {
          if(!result) {
            console.error("validateBlockConnection not valid");
            return reject(false);
          }
          else {
            self.getBlock(height).then(function(data) {
              console.log("current block", data);
              var currentBlockPrevHash = (JSON.parse(data).previousBlockHash).toString();
              console.log("current blockHash", currentBlockPrevHash);
              if(height > 0 ) {
                self.getBlock(height - 1).then(function(prevdata) {

                  console.log("previous block", prevdata);

                  let prevBlockCurrentHash = (JSON.parse(prevdata).hash).toString();

                  console.log("compare var 1: prevBlockCurrentHash: ", prevBlockCurrentHash);                  
                  console.log("compare var 2: currentBlockPrevHash: ", currentBlockPrevHash);

                  if(prevBlockCurrentHash == undefined || prevBlockCurrentHash == null ||
                   currentBlockPrevHash == undefined || currentBlockPrevHash == null ||
                   prevBlockCurrentHash != currentBlockPrevHash) 
                  {
                    console.log("validateBlockConnection no valid");
                    return reject(false);
                  }
                  else {
                    console.log("validateBlockConnection valid");
                    var valid_conn = "Your Block has a Valid connection for " + currentBlockPrevHash;
                    console.log(self.comments().replace("{0}", "=".repeat(valid_conn.length)));
                    console.log(self.comments().replace("{0}", valid_conn));
                    console.log(self.comments().replace("{0}", "=".repeat(valid_conn.length)));                       
                    return resolve(true);
                  }
                })                
              }
              else if(height == 0){
                console.log("validateBlockConnection valid");
                return resolve(true);
              }
            })
          }
        })
      })
    }



    /* ============================= validateChain ================================|
    |  - Validate the complete Blockchain using this method                        |
    |  ===========================================================================*/
   validateChain(){
    var self = this;
    return(new Promise(function(resolve, reject) {
      getCompleteBlocksDBData().then(function(data) {
        let errorLog = [];
        var promiseArray = [];
        for (var i = 0; i < data.length; i++) {
              // validate block
              promiseArray.push(self.validateBlockConnection(i))
            }

            Promise.all(promiseArray).then(function(result) {
              console.log(result);
              if (data.length == promiseArray.length) {

              var valid_chain = "WOWWW!! You did it. Your Blockchain is valid";
              console.log(self.comments().replace("{0}", "=".repeat(valid_chain.length)));              
              console.log(self.comments().replace("{0}", valid_chain));
              console.log(self.comments().replace("{0}", "=".repeat(valid_chain.length)));
              return resolve(true);

              } else {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: '+errorLog);
                return resolve(false);
              }
            })
            .catch(function(err) {
              console.log("Your Blockchain is not valid");
              return resolve(false);
            })
          })
    }));
  }
}

/* ============================= Module Exports ===============================|
|  - Exports the functions                                                     |
|  ===========================================================================*/
module.exports = { Blockchain }


/* ================================ Testing ===================================|
|  - Self-invoking function to add blocks to chain                             |
|  ===========================================================================*/
/*
(function theLoop (i) {
      let myBlockChain = new Blockchain();
    setTimeout(function () {

        let blockTest = new Block("Test Block - " + (i + 1));
        myBlockChain.addBlock(blockTest).then((result) => {
            console.log(result);
            i++;
            if (i < 10) theLoop(i);
        });
    }, 10000);
  })(0);
  */
  