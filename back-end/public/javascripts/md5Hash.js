const md5 = require('md5')

const MD5 = function(val, solt) {
    return new Promise((resolve, reject) => {
        let passSolt = md5(md5(val) + solt)
        resolve(passSolt)
    }) 
}
module.exports = MD5