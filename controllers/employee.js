const Employee = require('../models/employee');
const { validationResult } = require('express-validator/check');
const fileHelper = require('../util/file');
const bcrypt = require('bcrypt');

exports.getEmployee = async (req, res, next) => {
  const employeeId = req.params.id;
  try {
    const employee = await Employee.findByPk(employeeId);
    res.status(200).json({ user: employee });
  } catch (err) {
    if (!err.statusCode) {     
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getEmployees = async (req, res, next) => {
  const facility = req.header('facilityId');
  try {
    const employees = await Employee.findAll({
      where: { facilityId: facility },
    });
    res.status(200).json({ employees: employees });
  } catch (err) {
    if (!err.statusCode) {    
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createEmployee = async (req, res, next) => {
  const facility = req.header('facilityId');
  const email = req.body.email;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed incorrect information entered');
    error.statusCode = 422;
    throw error;
  }
  try {
    const user = await Employee.findByPk(req.id);

    if (user.is_admin !== true) {
      const error = new Error('Not authorized to add new employee');
      error.statusCode = 401;
      throw error;
    }  
    const existingEmployee  = await Employee.findOne({where: {email: email, facilityId: facility}})
    if(existingEmployee) {
      const error = new Error('Employee already exists');
      error.statusCode = 422;
      throw error;
    }
    const name = req.body.name;    
    const is_admin = req.body.is_admin;
    const image = req.file; 
    const nameArray = name.split(' ');
    const first = nameArray[0].substring(0, 2).toLowerCase();
    const last = nameArray[1].substring(0, 2).toLowerCase();
    const middle = Math.floor(Math.random() * 10000);
    const username = first + middle + last;
    var pwdChars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var pwdLen = 7;
    var randPassword = Array(pwdLen)
      .fill(pwdChars)
      .map((x) => {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
    const password = await bcrypt.hash(randPassword, 12);
    const employee = await Employee.create({
      name: name,
      email: email,
      is_admin: is_admin,
      userName: username,
      password: password,
      image: image ? image.path : null,
      facilityId: facility,
    });
    res.status(201).json({
      message: 'Employee Created',
      employee: employee,
    });
  } catch (err) {
    if (!err.statusCode) {     
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  const employeeId = req.params.id;
  try {
    const user = await Employee.findByPk(req.id);
    if (user.is_admin !== true) {
      const error = new Error('Not authorized to delete employee');
      error.statusCode = 401;
      throw error;
    }
    const employee = await Employee.findByPk(employeeId);
    if (employee.image) {
      fileHelper.deleteFile(employee.image);
    }
    const deleted = await employee.destroy();
    res.status(200).json({ id: employee.id, message: 'Employee Deleted!' });
  } catch (err) {
    if (!err.statusCode) {     
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editEmployee = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed incorrect information entered');
    error.statusCode = 422;
    throw error;
  }
  try {
    const user = await Employee.findByPk(req.id);
    if (user.is_admin !== true) {
      const error = new Error('Not authorized to edit employee');
      error.statusCode = 401;
      throw error;
    }   
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    const updated_is_admin = req.body.is_admin;
    const updated_is_active = req.body.is_active;
    const employeeId = req.params.id;
    const updatedImage = req.file;
    const employee = await Employee.findByPk(employeeId);
    employee.name = updatedName;
    employee.email = updatedEmail;
    employee.is_active = updated_is_active;
    employee.is_admin = updated_is_admin;    
    if (updatedImage) {  
      if(employee.image) {
        fileHelper.deleteFile(employee.image);
      }    
      employee.image = updatedImage.path;
    }
    const updatedEmployee = await employee.save();  
    console.log(updatedEmployee) 
    res
      .status(200)
      .json({ message: 'Employee Updated!', employee: updatedEmployee });
  } catch (err) {
    if (!err.statusCode) {      
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editUserProfile = async(req, res, next) => {
  const updatedName = req.body.name;
  const updatedEmail = req.body.email; 
  const employeeId = req.params.id;
  const updatedImage = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed incorrect information entered');
    error.statusCode = 422;
    throw error;
  }
  try {
    const user = await  Employee.findByPk(employeeId)
    if (employee.id !== req.id) {
      const error = new Error('Not Authorized to edit this profile');
      error.statusCode = 401;
      throw error;
    }
    employee.name = updatedName;
    employee.email = updatedEmail;
    if (updatedImage) {
      fileHelper.deleteFile(employee.image);
      employee.image = updatedImage.path;
      const updatedEmployee = await employee.save()
      res.status(200).json({ message: 'Employee Updated!', employee: updatedEmployee });
    }
  }
 catch(err) {
  if (!err.statusCode) {
    const error = new Error('Failed to update Employee');
    error.statusCode = 500;
  }
  next(err);
 }  
};
