const fs = require('fs');

const deleteFile = (filePath) => {  
    console.log("deleting file") 
    console.log("file path",filePath)
fs.unlink(filePath, err => {
    console.log(err)
} )
}

exports.deleteFile = deleteFile;