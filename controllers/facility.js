const Facility = require('../models/facility');
const bcrypt = require('bcrypt');
const Employee = require('../models/employee');

exports.signup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const adminName = req.body.adminName;
  const adminEmail = req.body.adminEmail;
  const userName = req.body.userName;
  const password = req.body.password;
  try {
    const facility = await Facility.findOne({ where: { email: email } });
    if (facility) {
      console.log('in if statement');
      const error = new Error('Facility already enrolled');
      error.statusCode = 303;
      throw error;
    }
    const newFacility = await Facility.create({
      name: name,
      email: email,
    });
    const password = await bcrypt.hash(password, 12);
    const newEmployee = await newFacility.createEmployee({
      name: adminName,
      email: adminEmail,
      userName: userName,
      password: hashedPassword,
      is_active: true,
      is_admin: true,
      checked_in: false,
    });
    res.status(201).json({ message: 'Facility enrolled' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editFacility = async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const userId = req.header('uid');
  try {
    const user = await Employee.findByPk(userId);
    if (user.is_admin === false) {
      const error = new Error('Not Authorized');
      error.statusCode = 401;
      throw error;
    }
    const editingFacility = await Facility.findByPk(id);
    editingFacility.name = name;
    editingFacility.email = email;
    const updatedFacility = await editingFacility.save();
    res.status(200).json({
      facility: updatedFacility,
      message: 'Facility Updated!',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFacility = async (req, res, next) => {
  const id = req.params.id;
  const userId = req.header('uid');
  try {
    const user = await Employee.findByPk(userId);
    if (user.is_admin === false) {
      const error = new Error('Not Authorized');
      error.statusCode = 401;
      throw error;
    }
    const facility = await Facility.findByPk(id);
    res.json(facility);
  } catch (err) {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  }
};
