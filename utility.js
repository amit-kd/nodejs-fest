const fs = require('fs');
export class Utility {
    readFileAsJson(fileName, cb) {
        fs.readFile(fileName, cb);
    }
}