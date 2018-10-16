const fs = require('fs');
class Utility {
    readFileAsJson(fileName, cb) {

    }
    writeFileAsJson(fileName, data, cb) {
        console.log("working")
        fs.writeFile(fileName, data, cb);
    }
}
module.exports.Utility = Utility;