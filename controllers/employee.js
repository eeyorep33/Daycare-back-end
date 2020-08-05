const Employee = require('../models/employee');
const { validationResult } = require('express-validator/check');
const fileHelper = require('../util/file');
const bcrypt = require('bcrypt');

exports.getEmployee = (req, res, next) => {
  const employeeId = req.params.id;
  Employee.findByPk(employeeId)
    .then((employee) => {
      res.status(200).json({ employee: employee });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error('Failed to get Employee');
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.getEmployees = (req, res, next) => {
  Employee.findAll()
    .then((employees) => {
      res.status(200).json({ employees: employees });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error('Failed to get Employees');
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.createEmployee = (req, res, next) => {
  Employee.findByPk(req.id).then((user) => {
    if (user.is_admin !== true) {
      const error = new Error('Not authorized to add new employee');
      error.statusCode = 401;
      throw error;
    }
  });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed incorrect information entered');
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
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

  console.log(randPassword);
  bcrypt
    .hash(randPassword, 12)
    .then((hashedPassword) => {
      Employee.create({
        name: name,
        email: email,
        is_admin: is_admin,
        userName: username,
        password: hashedPassword,
        image: image ? image.path : null,
      }).then((employee) => {
        res.status(201).json({
          message: 'Employee Created',
          employee: employee,
        });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error('Failed to create Employee');
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteEmployee = (req, res, next) => {
  username.findByPk(req.id).then((user) => {
    if (user.is_admin !== true) {
      const error = new Error('Not authorized to delete employee');
      error.statusCode = 401;
      throw error;
    }
  });
  const employeeId = req.params.id;
  Employee.findByPk(employeeId)
    .then((employee) => {
      if (employee.image) {
        fileHelper.deleteFile(employee.image);
      }
      return employee.destroy();
    })
    .then(() => {
      res.status(200).json({ message: 'Employee Deleted!' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error('Failed to delete Employee');
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.editEmployee = (req, res, next) => {
  Employee.findByPk(req.id).then((user) => {
    if (user.is_admin !== true) {
      const error = new Error('Not authorized to edit employee');
      error.statusCode = 401;
      throw error;
    }
  });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed incorrect information entered');
    error.statusCode = 422;
    throw error;
  }
  const updatedName = req.body.name;
  const updatedEmail = req.body.email;
  const updated_is_admin = req.body.is_admin;
  const updated_is_active = req.body.is_active;
  const updated_checked_in = req.body.checked_in;
  const employeeId = req.params.id;
  const updatedImage = req.file;
  Employee.findByPk(employeeId)
    .then((employee) => {
      employee.name = updatedName;
      employee.email = updatedEmail;
      employee.is_active = updated_is_active;
      employee.is_admin = updated_is_admin;
      employee.checked_in = updated_checked_in;
      if (updatedImage) {
        fileHelper.deleteFile(employee.image);
        employee.image = updatedImage.path;
      }
      return employee.save().then((employee) => {
        res
          .status(200)
          .json({ message: 'Employee Updated!', employee: employee });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error('Failed to update Employee');
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.editUserProfile = (req, res, next) => {
  const updatedName = req.body.name;
  const updatedEmail = req.body.email;
  const updated_checked_in = req.body.checked_in;
  const employeeId = req.params.id;
  const updatedImage = req.file;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed incorrect information entered');
    error.statusCode = 422;
    throw error;
  }
  Employee.findByPk(employeeId)
    .then((employee) => {
      if (employee.id !== req.id) {
        const error = new Error('Not Authorized to edit this profile');
        error.statusCode = 401;
        throw error;
      }
      employee.name = updatedName;
      employee.email = updatedEmail;

      employee.checked_in = updated_checked_in;
      if (updatedImage) {
        fileHelper.deleteFile(employee.image);
        employee.image = updatedImage.path;
      }
      return employee.save().then((employee) => {
        res
          .status(200)
          .json({ message: 'Employee Updated!', employee: employee });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error('Failed to update Employee');
        error.statusCode = 500;
      }
      next(err);
    });
};
