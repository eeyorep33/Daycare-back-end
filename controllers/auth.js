const bcrypt = require('bcrypt');
const Employee = require('../models/employee');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');


exports.login = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
  }
  let loadedUser;
  const userName = req.body.userName;
  const password = req.body.password;
  try {
    const user = await Employee.findOne({ where: { userName: userName } });
    console.log("user", user)
    if (!user) {
      const error = new Error('No user found');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    console.log('Password match');
    console.log(isEqual);
    if (!isEqual) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }
    const token = await jwt.sign(
      {
        userName: user.userName,
        id: user.id,
        facilityId: user.facilityId,
      },
      'thisisthesecretkeydonttellanyone',
      { expiresIn: '3h' }
    );
    res
      .status(200)
      .json({ token: token, user: user, facilityId: user.facilityId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  console.log("body")
  console.log(req.body)

  const updatedPassword = req.body.newPassword;
  const currentPassword = req.body.password;
  const userName = req.body.userName;
  try {
    const user = await Employee.findOne({ where: { userName: userName } });
    if (!user) {
      console.log("in no user")
      const error = new Error('No user found');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(currentPassword, user.password);

    if (!isEqual) {
      console.log("in no match")
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }
    const newPassword = await bcrypt.hash(updatedPassword, 12);
    user.password = newPassword;
    const updated = await user.save();
    console.log(updated)
    res.status(200).json({user: updated, message: "Password Updated"});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


