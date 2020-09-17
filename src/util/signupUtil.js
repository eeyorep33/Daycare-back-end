const bcrypt = require('bcrypt');

exports.passwordGenerator = () => { 
    let pwdChars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let pwdLen = 7;
  return  Array(pwdLen)
    .fill(pwdChars)
    .map((x) => {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join('');
  
  
}

exports.encryptPassword = (password) => {
 return  bcrypt.hash(password, 12);
}

exports.userNameGenerator = (name) => {   
    const nameArray = name.split(' ')
    const first = nameArray[0].substring(0, 2).toLowerCase();
    const last = nameArray[1].substring(0, 2).toLowerCase();
    const middle = Math.floor(Math.random() * 10000);

    return first + middle + last;
}