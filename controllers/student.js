const Student = require('../models/student');
const { validationResult } = require('express-validator/check');
const fileHelper = require('../util/file');


exports.getStudent = (req, res, next) => {
    const studentId= req.params.id;
Student.findByPk(studentId)
.then(student => {
    res.status(200).json({student: student})
}).catch((err) => {
    if (!err.statusCode) {
      const error = new Error("Failed to get Student");
      error.statusCode = 500;
    }
    next(err);
  });

};

exports.getStudentsByClassroom = (req, res, next) => {
    const classroomId = req.params.id
Student.findall({where: {classroomId}})
.then(students => {
    res.status(200).json({students: students})
})
.catch((err) => {
    if (!err.statusCode) {
      const error = new Error("Failed to get Students");
      error.statusCode = 500;
    }
    next(err);
  });
};

exports.getStudents = (req, res, next) => {
Student.findall()
.then(students => {
    res.status(200).json({students: students})
})
.catch((err) => {
    if (!err.statusCode) {
      const error = new Error("Failed to get Students");
      error.statusCode = 500;
    }
    next(err);
  });
};

exports.createStudent = (req, res, next) => {  
  username.findByPk(req.id).then((user) => {
    if (user.is_admin !== true) {
      const error = new Error('Not authorized to add new student');
      error.statusCode = 401;
      throw error;
    }
  });
const name = req.body.name;
const email = req.body.email;
const image = req.file.path;
const errors = validationResult(req);
if(!errors.isEmpty()) {
  const error = new Error('Validation failed incorrect information entered');
  error.statusCode = 422;
  throw error;
}
//const image = req
Student.create({
    name: name,
    email: email,
    image: image 
})
.then(student => {
res.status(201).json({
    message: "Student created",
    student: student
})
})
.catch((err) => { 
    if (!err.statusCode) {
      const error = new Error("Failed to create Student");
      error.statusCode = 500;
    }
    next(err);
  });
};

exports.deleteStudent = (req, res, next) => {
  username.findByPk(req.id).then((user) => {
    if (user.is_admin !== true) {
      const error = new Error('Not authorized to delete student');
      error.statusCode = 401;
      throw error;
    }
  });
const studentId = req.params.id;
Student.findByPk(studentId)
.then(student => {
  if(student.image) {
    fileHelper.deleteFile(student.image);
  }
return student.destroy()
.then(result => {
    res.status(200).json({
        message: "Student Deleted"

    })
})
})
.catch((err) => {
    if (!err.statusCode) {
      const error = new Error("Failed to delete Student");
      error.statusCode = 500;
    }
    next(err);
  });
};

exports.editStudent = (req, res, next) => {
  username.findByPk(req.id).then((user) => {
    if (user.is_admin !== true) {
      const error = new Error('Not authorized to edit student');
      error.statusCode = 401;
      throw error;
    }
  });
  const errors = validationResult(req);
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    const updatedImage = req.file;
    const updated_is_active = req.body.is_active;
    const updated_checked_in =req.body.checked_in;
    const studentId = req.params.id;
    
    if(!errors.isEmpty()) {
     const error = new Error('Validation failed incorrect information entered');
     error.statusCode = 422;
     throw error;
    }
    Student.findByPk(studentId)
.then(student => {
    console.log(student);
student.name = updatedName;
student.email = updatedEmail;
student.is_active = updated_is_active;
student.checked_in =updated_checked_in;
if(updatedImage) {
  fileHelper.deleteFile(student.image);
  student.image = updatedImage.path;
}
return student.save()
.then(student => {
res.status(200).json({
    message: "Student updated.",
    student: student
})
})
})
.catch((err) => {
    if (!err.statusCode) {
      const error = new Error("Failed to update Student");
      error.statusCode = 500;
    }
    next(err);
  });
}