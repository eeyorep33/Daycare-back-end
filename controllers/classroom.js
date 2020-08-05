const Classroom = require('../models/classroom');


exports.getClassrooms = (req,res, next) => { 
Classroom.findAll()
.then((classrooms) => {
    res.status(200).json({ classrooms: classrooms });
  })
  .catch((err) => {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  });
};

exports.getClassroom = (req, res, next) => {
const classroomId = req.params.id;
Classroom.findByPk(classroomId)
.then(classroom => {
    res.status(200).json({ classroom: classroom }); 
})
.catch((err) => {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  });
};

exports.createClassroom = (req, res, next) => {  
    const classroomName = req.body.classroomName;
    const facility = req.body.facilityId;
    const userId = req.header('uid');
    console.log(userId)
Classroom.create({
    name: classroomName,
    facilityId: facility
})
.then((classroom) => {   
    res.status(201).json({
      message: 'Classroom Created',
      classroom: classroom,
    });
  })
  .catch((err) => {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  });
};

exports.deleteClassroom = (req, res, next) => {
const classroomId = req.params.id;
const classroom = Classroom.findByPk(classroomId)
.then(classroom => {
return classroom.destroy();
})
.then(() => {    
    res.status(200).json({ message: 'Classroom Deleted!' });
})
.catch((err) => {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  });
};

exports.editClassroom = (req, res, next) => {
    const classroomId = req.params.id;
    const newClassroomName = req.body.name;
    Classroom.findByPk(classroomId)
.then(classroom => {
classroom.name = newClassroomName;
return classroom.save().then((result) => {   
    res.status(200).json({ message: 'Classroom Updated!' });
  });
})
.catch((err) => {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  });

};