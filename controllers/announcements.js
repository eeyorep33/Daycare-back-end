const Announcements = require('../models/announcements');
const Employee = require('../models/employee');

exports.getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcements.findAll({where: {facilityId: req.params.id}})
    res.json({announcements: announcements})
  }
  catch(err) {
    if (!err.statusCode) {
      const error = new Error('Failed to delete Employee');
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.updateAnnouncements = async (req,res,next) => {
  try {
    console.log("id")
    console.log(req.params.id)
    const user = await Employee.findByPk(req.id)
    if (!user.is_admin) {
      const error = new Error('Not authorized to update announcements');
      error.statusCode = 401;
      throw error;
    }      
    const updatedContent = req.body.content;
    const announcement = await Announcements.findByPk(req.params.id)   
    announcement.content = updatedContent;
    const newAnnouncement = await announcement.save()
    res.json({announcement: newAnnouncement})
  }
   catch(err) {
    if (!err.statusCode) {
      const error = new Error('Failed to delete Announcement');
      error.statusCode = 500;
    }
    next(err);
   }
  }

exports.deleteAnnouncements = async (req,res,next) => {
  const announcementId = req.params.id;
  try {
    const user = await    Employee.findByPk(req.header("uid"))
    if (!user.is_admin) {
      const error = new Error('Not authorized to delete announcements');
      error.statusCode = 401;
            throw error;
    }
    const announcement = await   Announcements.findByPk(announcementId)
     const result = await     announcement.destroy();
     console.log(result)
     res.status(200).json({ message: 'Announcement Deleted!' });
  }
  catch(err) {
    if (!err.statusCode) {
      const error = new Error('Failed to delete Announcement');
      error.statusCode = 500;
    }
    next(err);
  }
       
}


exports.addAnnouncements = async (req,res,next) => {
    const content = req.body.content;    
    const facilityId = req.body.facilityId
    try {
      const user = await  Employee.findByPk(req.id)
      if (!user.is_admin) {
        const error = new Error('Not authorized to add announcements');
        error.statusCode = 401;
        throw error;
      }
      const announcement = await Announcements.create({
        facilityId: facilityId,
        content: content
        })
        res.json({announcement: announcement})
    }
   catch(err) {
    if (!err.statusCode) {
      const error = new Error('Failed to delete Announcement');
      error.statusCode = 500;
    }
    next(err);
   }      
  
}