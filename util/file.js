const fs = require('fs');

const deleteFile = (filePath) => {  
    console.log("deleting file") 
fs.unlink(filePath, err => {
    console.log(err)
} )
}

exports.deleteFile = deleteFile;