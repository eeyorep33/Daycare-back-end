const fs = require('fs');

const deleteFile = (filePath) => {  
fs.unlink(filePath), (err) => {
    if(err) {
        console.log('in error block')
        throw(err);
    }
}
}

exports.deleteFile = deleteFile;