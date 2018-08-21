const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname,'/datalist.json'),(err,data)=>{
  if(err) exports.feedback = '500 server error';
  exports.feedback = JSON.parse(data);
})