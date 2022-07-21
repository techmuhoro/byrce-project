/**
 * Main file for helper function
 */

//Dependecies
const crypto = require('crypto');
const User = require('../Models/User');

//Container for all methods
const helpers = {};

helpers.formatFeatures = function (str) {
  str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : false;
  if(str){
    return str.split(',').map(item => item.trim());
  }
  return [];
};

helpers.getImagesPaths = function(files){
  //Sanitiza the files array
  files = typeof files === 'object' && files instanceof Array ? files : [];
  const filesArray = [];
  for(let file of files){
    let path = '/images/' + file.filename;
    filesArray.push(path);
  }

  return filesArray;
}

//Hash a password
helpers.hash = async function(str){
  str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : false;
  if(str){
    return new Promise(function(resolve, reject){
      const salt = crypto.randomBytes(8).toString('hex');
      crypto.scrypt(str, salt, 64, function(err, derivedKey){
        if(err) reject(err);
        resolve(salt + ":" + derivedKey.toString("hex"));
      });
    });
  }
};

// Verify a password
helpers.verify = async function(password, hash){
  return new Promise(function(resolve, reject){
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, function(err, derivedKey){
      if(err) reject(err);
      resolve(key == derivedKey.toString('hex'));
    });
  });
}

// check if email exist in database;
helpers.ifEmailExistInDatabase = async function(email){
  return new Promise(async function(resolve, reject){
    try{
      const users = await User.find();
      let emailExist = false;
      for(let user of users){
        if(emailExist){
          break;
        }
        if(user.email === email){
          emailExist = true;
        }
      }
      resolve(emailExist);

    }catch(e){
      console.log(e);
    }
  });
};

//export the container
module.exports = helpers;