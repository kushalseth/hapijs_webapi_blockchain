/* ================== Persist data with LevelDB ======================|
|  Learn more: level: https://github.com/Level/level                  |
|  ==================================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);



/* ============================ addLevelDBData ================================|
|  - Add data to levelDB with key/value pair                                   | 
|  ===========================================================================*/
function addLevelDBData(key,value) {  
  return new Promise(function(resolve, reject) {
    db.put(key, value, function(err) {
      if (err) {
        err = "error occured while creating the addLevelDBData", err;        
        return reject(err)
      } else {
        console.log("addLevelDBData success:", JSON.stringify(value));
         return resolve(value);
      }
      });
  })
}



/* ============================ getLevelDBData ================================|
|  - Get data from levelDB with key                                            | 
|  ===========================================================================*/
function getLevelDBData(key) {

  return new Promise(function(resolve, reject) {
    db.get(key, function(err, value) {
      if (err) {
        var obj = {
          error: "Error. Block doesnot exist."
        }
       return reject(obj); 
      }      
      else {
        console.log("getLevelDBData success: ", JSON.stringify(value));
        //return resolve(JSON.stringify(value))
        return resolve(value) 
      };
    })
  })
}

/* =========================== addDataToLevelDB ===============================|
|  - Add data to levelDB with value                                            | 
|  ===========================================================================*/
function addDataToLevelDB(value) {

  return new Promise(function(resolve, reject) {
    let i = 0;
    db.createReadStream()
    .on('data', function(data) {
      i++;
    })
    .on('error', function(err) {
      return reject(err);            
          })
    .on('close', function() {
      console.log('addDataToLevelDB (just before addLevelDBData) Block #' + i + " value # " + JSON.stringify(value));   
      addLevelDBData(i, value).then(function(data) {        
        return resolve(data);
      });
    });    
  });
}



/* ======================== getCompleteBlocksDBData ===========================|
|  - Get all the BlocksData                                                    | 
|  ===========================================================================*/
function getCompleteBlocksDBData() {
  return new Promise(function(resolve, reject) {
    let datArray = [];
    
    db.createReadStream()
    .on("data", function(data) {
      //console.log("data:", data)
     datArray.push(data);
   })
    .on("error", function(error) {
      return reject(error);
    })
    .on('close', function() {

      console.log("getCompleteBlocksDBData resolved");
      console.log("BlockChain Length", datArray.length);
      return resolve(datArray.sort((a, b) => a.key - b.key));
    });
  })
}

/* ========================== ALERT: deleteAllData ============================|
|  - Don't have this method on production. It's just for local to delete       |
|  - and validates the blockchain                                              | 
|  ===========================================================================*/
function deleteAllData() {
  getCompleteBlocksDBData().then(function(data) {
    for(var i = 0; i < data.length; i++) {
      db.del(i);
    }
  })
}


/* ============================== printAllData ================================|
|  - Print all the Blocks in Blockchain                                        |
|  ===========================================================================*/
function printAllData() {
  getCompleteBlocksDBData().then(function(data) {
    for(var i = 0; i < data.length; i++) {
      console.log("print parse: ", JSON.stringify(data[i]));
    }
  })
}


/* ============================= Module Exports ===============================|
|  - Exports the functions                                                     |
|  ===========================================================================*/
module.exports = {
  addDataToLevelDB,
  addLevelDBData,
  getLevelDBData,
  getCompleteBlocksDBData
}