const Student = require('../models/student');
const Employee = require('../models/employee');
const { validationResult } = require('express-validator/check');
const fileHelper = require('../util/file');
const Classroom = require('../models/classroom');
const Report = require('../models/report');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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

exports.getStudent = async (req, res, next) => {
  const studentId = req.params.id;
  try {
    const student = await Student.findByPk(studentId);
    res.status(200).json({ student: student });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.studentSearch = async (req, res, next) => {
  const facility = req.header('facilityId');
  const student = req.params.name
  try {
    const students = await Student.findAll({ where: { facilityId: facility, name:  {[Op.like]: '%' + student + '%'}} });
   res.json({students: students})

  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getStudentsByClassroom = async (req, res, next) => {
  const classroomId = req.params.id;
  try {
    const classroom = await Classroom.findByPk(classroomId);
    const students = await Student.findAll({ where: { classroomId } });
    res.status(200).json({ students: students, classroom: classroom });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStudents = async (req, res, next) => {
  const facility = req.header('facilityId');
  try {
    const students = await Student.findAll({ where: { facilityId: facility } });
    res.status(200).json({ students: students });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const facility = req.header('facilityId');
  try {
    const employee = await Employee.findByPk(req.id);
    if (employee.is_admin !== true) {
      const error = new Error('Not authorized to add new student');
      error.statusCode = 401;
      throw error;
    }
    const existingStudent = await Student.findOne({
      where: { email: email, facilityId: facility },
    });
    if (existingStudent) {
      const error = new Error('Student already enrolled');
      error.statusCode = 422;
      throw error;
    }

    const classroom = req.body.classroomId;
    const image = req.file;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        'Validation failed incorrect information entered'
      );
      error.statusCode = 422;
      throw error;
    }
    const student = await Student.create({
      name: name,
      email: email,
      image: image ? image.path : null,
      facilityId: facility,
      classroomId: classroom,
      checked_in: false,
    });
    res.status(201).json({
      message: 'Student created',
      student: student,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.id);
    if (employee.is_admin !== true) {
      const error = new Error('Not authorized to delete student');
      error.statusCode = 401;
      throw error;
    }
    const studentId = req.params.id;
    const student = await Student.findByPk(studentId);
    if (student.image) {
      fileHelper.deleteFile(student.image);
    }
    const deletedStudent = await student.destroy();
    res
      .status(200)
      .json({ student: deletedStudent, message: 'Student Deleted' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editStudentImage = async (req, res, next) => {
  console.log('in edit image function');
  const updatedImage = req.file;
  const studentId = req.params.id;
  try {
    const student = await Student.findByPk(studentId);
    if (updatedImage) {
      if (student.image) {
        fileHelper.deleteFile(student.image);
      }
      student.image = updatedImage.path;
    }
    const updatedStudent = await student.save();
    res.status(200).json({
      message: 'Student updated.',
      student: updatedStudent,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.checkIn = async (req, res, next) => {
  const studentId = req.params.id;
  try {
    const student = await Student.findByPk(studentId);
    student.checked_in = true;
    const updatedStudent = await student.save();
    const report = await Report.create({
      studentId: studentId,
    });
    res.status(200).json({
      message: 'Student checked In.',
      student: updatedStudent,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editStudent = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.id);
    if (employee.is_admin !== true) {
      const error = new Error('Not authorized to edit student');
      error.statusCode = 401;
      throw error;
    }
    const errors = validationResult(req);
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    const updatedImage = req.file;
    const updated_is_active = req.body.is_active;
    const updatedClassroomId = req.body.classroomId;
    const studentId = req.params.id;

    if (!errors.isEmpty()) {
      const error = new Error(
        'Validation failed incorrect information entered'
      );
      error.statusCode = 422;
      throw error;
    }

    const student = await Student.findByPk(studentId);
    student.name = updatedName;
    student.email = updatedEmail;
    student.is_active = updated_is_active;
    student.classroomId = updatedClassroomId;
    if (updatedImage) {
      if (student.image) {
        fileHelper.deleteFile(student.image);
      }
      student.image = updatedImage.path;
    }
    const updatedStudent = await student.save();
    res.status(200).json({
      message: 'Student updated.',
      student: updatedStudent,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.checkOut = async (req, res, next) => {
  const studentId = req.params.id;
  try {
    const student = await Student.findByPk(studentId);
    student.checked_in = false
    const updatedStudent = await student.save()
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    const date = moment().format('MM/DD/YYYY');
    const report = await Report.findOne({
      include: [
        'feedings',
        'diaperings',
        'comments',
        'supplies',
        'naptimes',
        'playtimes',
        'medicines',
      ],
      where: {
        createdAt: { [Op.gt]: start, [Op.lt]: end },
        studentId: studentId,
      },
    });
    let feeds = '';
    let comment = '';
    let nap = '';
    let s = '';
    let diaper = '';
    let meds = '';
    let play = '';

    if (report.feedings.length > 0) {
      for (let i = 0; i <= report.feedings.length - 1; i++) {
        feeds += `<div class="margin">
               <p class="row foodRow">${report.feedings[i].food}</p>
               <p class=" amountRow row ">${report.feedings[i].amount}</p>
               <p class="row">${moment(report.feedings[i].time, 'HH:mm').format(
                 'h:mm a'
               )}</p>
               </div>`;
      }
    }

    if (report.naptimes.length > 0) {
      for (let i = 0; i <= report.naptimes.length - 1; i++) {
        nap += `<div class="margin">
<p class=" typeRow row">${moment(report.naptimes[i].start_time, 'HH:mm').format(
          'h:mm a'
        )}</p>
<p  class="row">${moment(report.naptimes[i].end_time, 'HH:mm').format(
          'h:mm a'
        )}</p>
</div>`;
      }
    }

    if (report.diaperings.length > 0) {
      for (let i = 0; i <= report.diaperings.length - 1; i++) {
        diaper += `<div class="margin">
<p class=" typeRow row">${report.diaperings[i].type}</p>
<p  class="row">${moment(report.diaperings[i].time, 'HH:mm').format(
          'h:mm a'
        )}</p>
</div>`;
      }
    }

    if (report.medicines.length > 0) {
      for (let i = 0; i <= report.medicines.length - 1; i++) {
        meds += `<div class="margin">
 <p class=" foodRow row">${report.medicines[i].name}</p>
    <p class=" amountRow row">${report.medicines[i].dosage}</p>
    <p  class="row">${moment(report.medicines[i].time, 'HH:mm').format(
      'h:mm a'
    )}</p>
    </div> `;
      }
    }

    if (report.supplies.length > 0) {
      for (let i = 0; i <= report.supplies.length - 1; i++) {
        s += `<div class="margin">
        <p class="oneRow">${report.supplies[i].supply_item}</p>
        </div> `;
      }
    }

    if (report.comments.length > 0) {
      for (let i = 0; i <= report.comments.length - 1; i++) {
        comment += `<div class="margin">
<p class="oneRow">${report.comments[i].comment}</p> 
</div>`;
      }
    }

    if (report.playtimes.length > 0) {
      for (let i = 0; i <= report.playtimes.length - 1; i++) {
        play += `<div class="margin">
  <p class="oneRow">${report.playtimes[i].activity}</p>
  </div>  `;
      }
    }

    const emailHeaders = `<html>
         <head>
         <style scoped>
         #title{
             color: orange;
         }
         #hands{
             color: orange;
             padding: 15px
             }
             #date, #name{
                 margin: 0 0 20px 20px
             }
             #feedHeader, #napHeader, #medHeader, #diaperHeader, #supplyHeader,
             #commentHeader, #playHeader{
                 text-align:Center;
                 color: orange            
                 }  
                 div.margin {
                     margin: 10px 0 15px 0}
                 p.row {
                     display:inline
                     }
             p.foodRow {
                 margin: 0 210px 0 190px;
                 }
                  p.amountRow {
                 margin: 0 190px 0 0px;
                 }
             p.typeRow {
                    margin: 0 300px 0 250px;
                 }
                 p.oneRow {
                     text-align: Center
                     }
             
         @media screen and (max-width: 480px) {
         #date, #name {text-align: Center; margin-top: 30px}
         p.foodRow{margin: 0 20px 0 60px}
         p.amountRow{margin: 0 40px 0 20px}
         p.typeRow{margin: 0 80px 0 100px}
         }
         </style>
         </head> 
         
         
         
         <body style="border: 2px solid #00FFFF">
           <div  style="font-size:12px; line-height:20px;  text-align:Center; ">
             <div  style="font-size:12px; line-height:20px;  text-align:Center;" >
             <div style="background: #00FFFF; height: 50px; width: 100%">
             <h1 id="hands">Helping Hands</h1></div>
               <h1 id="title">Daily Report </h1></div>
           </div>
           <div>
           <h3 id="date"><span style="color: orange">Date:</span>&nbsp;${date}</h3>
            <h3 id="name"><span style="color: orange">Name:</span>&nbsp;${student.name}</h3>
           </div>`;

    const feedingHeader = `  <div>
           <h3 id="feedHeader">Feeding</h3>
           <div>
           <p class="foodRow row">Food</p>   
           <p class="amountRow row" >Amount</p>
           <p class="row">Time</p>
           <div>
           <hr/>
           </div>`;
    const footer = `  
           <hr  style="height: 3px; background:#00FFFF"></hr>
              </div>
             </div>`;

    const diaperHeader = `  <div>
             <h3 id="diaperHeader">
             Diapering</h3>
             <div>
             <p class="typeRow row" >Type</p>
           <p class="row">Time</p>
           <hr ></hr>`;

    const napHeader = `  <div>
               <h3 id="napHeader">Nap Times</h3>               
                <div>
                       <p class="typeRow row" >Start Time</p>
               <p class="row">End Time</p>
               <hr/>`;

    const medsHeader = `    <div>
               <h3 id="napHeader">Meds</h3>             
                <div>
                       <p class="foodRow  row" >Name</p>
                        <p class="amountRow  row" >Dosage</p>
               <p class="row"> Time</p>
               <hr/>`;

    const playHeader = `    <div>
               <h3 id="playHeader">Play Time</h3>               
                <div>
                <p class="oneRow" >Activity</p>
               
               <hr/>`;

    const supHeader = `
               <div>
               <h3 id="supplyHeader">Supplies</h3>             
               <div>
               <p class="oneRow" >Item</p>
               
               <hr/>`;

    const comHeader = `    <div>
               <h3 id="commentHeader">Comments</h3>
               
               

                <div>
                <p class="oneRow" >Comment</p>
             
             <hr/>`;
    const bodyFooter = `</body>
             </html>`;

    let feedSection = null;
    if (feeds) {
      feedSection = feedingHeader + feeds + footer;
    }

    let diaperSection = null;
    if (diaper) {
      diaperSection = diaperHeader + diaper + footer;
    }

    let napSection = null;
    if (nap) {
      napSection = napHeader + nap + footer;
    }

    let playSection = null;
    if (play) {
      playSection = playHeader + play + footer;
    }
    let supplySection = null;
    if (s) {
      supplySection = supHeader + s + footer;
    }

    let comSection = null;
    if (comment) {
      comSection = comHeader + comment + footer;
    }
    let medSection = null;
    if (meds) {
      medSection = medsHeader + meds + footer;
    }

   
    let email = emailHeaders;
    if (feedSection) {
      email += feedSection;
    }
    if (diaperSection) {
      email += diaperSection;
    }
    if (napSection) {
      email += napSection;
    }
    if (medSection) {
      email += medSection;
    }
    if (playSection) {
      email += playSection;
    }
    if (supplySection) {
      email += supplySection;
    }
    if (comSection) {
      email += comSection;
    }
    email += bodyFooter;
    transporter.sendMail({
      to: student.email,
      from: 'eeyorep33@gmail.com',
      subject: 'Daily Report',
      html: email,
    });
    res.json({ student: student });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
