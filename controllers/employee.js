const Employee = require('../models/employee');
const { validationResult } = require('express-validator/check');
const fileHelper = require('../util/file');
const signupUtil = require('../util/signupUtil')
const nodeMailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');


const transporter = nodeMailer.createTransport(
  sendGrid({
    auth: {
      api_key:
      process.env.EMAIL_KEY,
    },
  })
);


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
    const username =  await signupUtil.userNameGenerator(name);
    const password= await signupUtil.passwordGenerator()
    const encryptedPassword = await signupUtil.encryptPassword(password)
    const employee = await Employee.create({
      name: name,
      email: email,
      is_admin: is_admin,
      userName: username,
      password: encryptedPassword,
      image: image ? image.path : null,
      facilityId: facility,
    });
    transporter.sendMail({
      to: email,
      from: 'eeyorep33@gmail.com',
      subject: 'Signup Successful',
      html: `  <html>
      <head>
       
      </head>
      <body>
        <div style="font-size:12px; line-height:20px;  text-align:Center;" >
        <div style="background: #00FFFF; height: 50px; width: 100%">
        <h1 style="color: orange; padding: 15px">Helping Hands</h1></div>
         <h1 Style="color: orange;margin: 50px 0 0 0">Here is your user name and temporary password</h1>
         <h3 style="margin: 50px 0 0 0"><span style="color: orange">User Name: ${username}</span>
         <h3><span style="color: orange">Password: ${password}</span>
         </h3>
          </div>
        
        </div>
      </body>
    </html>`
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
  console.log("param user id")
    console.log(req.params.id)
  const updatedName = req.body.name;
  const updatedEmail = req.body.email; 
  const employeeId = req.params.id;
  const updatedImage = req.file;
  console.log(updatedImage)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed incorrect information entered');
    error.statusCode = 422;
    throw error;
  }
  try {
    const user = await  Employee.findByPk(employeeId)
    console.log("found user id")
    console.log(user.id)
    
    console.log("is equals")
    console.log(user.id !== req.params.id)
    if (user.id.toString() !== req.params.id) {
      console.log('in error block')
      const error = new Error('Not Authorized to edit this profile');
      error.statusCode = 401;
      throw error;
    }
    user.name = updatedName;
    user.email = updatedEmail;
    if (updatedImage) {
     if(user.image) {
      fileHelper.deleteFile(user.image);
     }     
      user.image = updatedImage.path;
      console.log("new User")
      console.log(user)      
    }
    const updatedEmployee = await user.save()
    
      res.status(200).json({ message: 'User Updated!', user: updatedEmployee });
  }
 catch(err) {
  if (!err.statusCode) {
    const error = new Error('Failed to update Employee');
    error.statusCode = 500;
  }
  next(err);
 }  
};
