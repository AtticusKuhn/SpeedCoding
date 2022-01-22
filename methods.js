const fs = require("fs")
const secret_key = process.env.SECRET_KEY
var encryptor = require('simple-encryptor')(secret_key);


function diff(a,b){
    return b.filter(function(i) {return a.indexOf(i) < 0;});
}
function verify_session(user, session_id){
    let jsondata = JSON.parse(fs.readFileSync("data/sessions.json"))
    return encryptor.decrypt(jsondata[user]) == session_id
      
}


module.exports = {
    diff:diff,
    verify_session:verify_session

}