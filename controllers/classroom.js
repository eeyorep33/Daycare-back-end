const Classroom = require('../models/classroom');
const MenuItem = require('../models/menu');
const Employee = require('../models/employee');
const Menu = require('../models/menu');

exports.getClassrooms = async (req, res, next) => {
  const facility = req.header("facilityId")
  try {
    const classrooms = await Classroom.findAll({where: {facilityId: facility}})
    res.status(200).json({ classrooms: classrooms });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getClassroom = async(req, res, next) => {
  const classroomId = req.params.id;
  try {
    const classroom = await  Classroom.findByPk(classroomId)
    res.status(200).json({ classroom: classroom });
  }
   catch(err) {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
   } 
  };

exports.createClassroom = async (req, res, next) => {
  const classroomName = req.body.classroomName;
  const facility = req.body.facilityId;
  const userId = req.header('uid');
  try {
    const user = await  Employee.findByPk(userId)
    if (user.is_admin === false) {     
      const error = new Error('Not Authorized');
      error.statusCode = 401;
      throw error;
    }
const classroom = await  Classroom.findOne({ where: { name: classroomName, facilityId: facility }
})
if (classroom) {  
  const error = new Error('Classroom already exists');
  error.statusCode = 401;
  throw error;
}
const newClassroom = await   Classroom.create({
  name: classroomName,
  facilityId: facility,
})
const menu =  await MenuItem.create({
  name: classroomName,
  level: 2,
  url: '/classroom/' + newClassroom.id,
  parent_menu_item: 'Classrooms',
  facilityId: facility,
});
res.status(201).json({
  message: 'Classroom Created',
  classroom: newClassroom,
});
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
 
};

exports.deleteClassroom = async(req, res, next) => {
  const classroomId = req.params.id; 
  const userId = req.header("uid")
  const facility = req.header("facilityId")
 
  try {
    const user = await  Employee.findByPk(userId)
    if(user.is_admin === false) {
      const error = new Error('Not Authorized');
      error.statusCode = 401;
      throw error;
    }
    const classroom = await   Classroom.findByPk(classroomId) 
    const result =  await classroom.destroy();
    const menu = await  Menu.findOne({where: {name: classroom.name, facilityId: facility}})
    const menuResult = await    menu.destroy()
    res.json({id: classroomId})
  }
   catch(err) {
    if (!err.statusCode) {
      error.statusCode = 500;
    }
    next(err);
   }
   
};

exports.editClassroom = async(req, res, next) => {
  const classroomId = req.params.id;
  const newClassroomName = req.body.name;
  const userId = req.header('uid');
  const facility = req.header('facilityId');  
  let oldClass = '';
  try {
    const user = await   Employee.findByPk(userId)
    if (user.is_admin === false) {      
      const error = new Error('Not Authorized');
      error.statusCode = 401;
      throw error;
    }
 const classroom = await  Classroom.findOne({
  where: { name: newClassroomName, facilityId: facility }
})
if (classroom) {            
  const error = new Error('Classroom already exists');
  error.statusCode = 401;
  throw error;
} 
const editingClassroom = await   Classroom.findByPk(classroomId)
oldClass = editingClassroom.name;
editingClassroom.name = newClassroomName
const newClassroom = await editingClassroom.save()
const menu = await  MenuItem.findOne({ where: { name: oldClass } })
menu.name = newClassroomName;
const menuResult = await menu.save()
res.status(200).json({
      classroom: newClassroom,
      menuItem: menu,
      message: 'Classroom Updated!',
     });
  }
 catch(err) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
 }    
 
};
