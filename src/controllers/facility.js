const Facility = require('../models/facility');
const bcrypt = require('bcrypt');
const Employee = require('../models/employee');
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

exports.signup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const adminName = req.body.adminName;
  const adminEmail = req.body.adminEmail;  
  try {
    const facility = await Facility.findOne({ where: { email: email } });
    if (facility) {     
      const error = new Error('Facility already enrolled');
      error.statusCode = 303;
      throw error;
    }
    const newFacility = await Facility.create({
      name: name,
      email: email,
    });
    const username =  await signupUtil.userNameGenerator(adminName);
    const password= await signupUtil.passwordGenerator()  
    console.log(password)
    const encryptedPassword = await signupUtil.encryptPassword(password)  
    const newEmployee = await newFacility.createEmployee({
      name: adminName,
      email: adminEmail,
      userName: username,
      password: encryptedPassword,
      is_active: true,
      is_admin: true,
      checked_in: false,
    });
    transporter.sendMail({
      to: adminEmail,
      from: 'eeyorep33@gmail.com',
      subject: 'Signup Successful',     
      html: `  <html>
      <head>
       
      </head>
      <body>
        <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
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
      err.statusCode = 500;
    }
    next(err);
  }
};
