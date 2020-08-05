const bcrypt = require('bcrypt');
const Employee = require('../models/employee');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');


exports.login = (req, res, next) => {  
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode =422;
    error.data = errors.array();
  }
  let loadedUser;
    const userName = req.body.userName;
  const password = req.body.password;
  Employee.findOne({ where: { userName: userName } })
  .then((user) => {
    if (!user) {
      const error = new Error('No user found');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;  
    facilityId = loadedUser.facilityId
    return bcrypt.compare(password, user.password);
  })
  .then(isEqual => {
      if(!isEqual) {
          const error = new Error('Invalid password');
          error.statusCode = 401;
          throw error;
      }
const token = jwt.sign({
  userName: loadedUser.userName,
  id: loadedUser.id,
  facilityId: loadedUser.facilityId
}, 'thisisthesecretkeydonttellanyone', {expiresIn: '1h'})
res.status(200).json({token: token, id: loadedUser.id, facilityId: facilityId})
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.resetPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const currentPassword = req.body.password;
  const userName = req.body.userName
  let loadedUser;
 Employee.findOne({ where: { userName: userName } })
  .then((user) => {
    console.log(user)
    if (!user) {      
      const error = new Error('No user found');
      error.statusCode = 401;
      throw error;
    }   
    loadedUser = user;
    return bcrypt.compare(currentPassword, user.password);
  })
  .then(isEqual => {
      if(!isEqual) {
          const error = new Error('Invalid password');
          error.statusCode = 401;
          throw error;
      }
      bcrypt
    .hash(newPassword, 12)
    .then((hashedPassword) => {
     loadedUser.password = hashedPassword;
     return loadedUser.save();
    })
    .then(res.status(200).json({message: 'Password updated'}))
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.resetUsername = (req, res, next) => {
  const newUserName = req.body.newUserName;
  const currentUserName = req.body.userName
  const password = req.body.password;
  let loadedUser;
 Employee.findOne({ where: { userName: currentUserName } })
  .then((user) => {
    if (!user) {
      const error = new Error('No user found');
      error.statusCode = 401;
      throw error;
    }   
    loadedUser = user;
    return bcrypt.compare(password, user.password);
  })
  .then(isEqual => {
      if(!isEqual) {
          const error = new Error('Invalid password');
          error.statusCode = 401;
          throw error;
      }
     loadedUser.userName = newUserName;
     return loadedUser.save();   
    
  })
  .then(result => {
    res.status(200).json({message: 'User name updated'})
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

