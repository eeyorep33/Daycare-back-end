const Announcements = require('../models/announcements');
const Employee = require('../models/employee');

exports.getAnnouncements = (req, res, next) => {
  console.log("in announcememts")
Announcements.findAll({where: {facilityId: req.params.id}})
.then(announcements => {
res.json({announcements: announcements})
})
}

exports.updateAnnouncements = (req,res,next) => {
    Employee.findByPk(req.id).then((user) => {
        if (!user.is_admin) {
          const error = new Error('Not authorized to update announcements');
          error.statusCode = 401;
          throw error;
        }
      });
    const updatedContent = req.body.content;
Announcements.findByPk(req.params.id)
.then(announcement => {
announcement.content = updatedContent;
return announcement.save()
.then(announcement => {
    res.json({announcement: announcement})
})
})
.catch((err) => {
    if (!err.statusCode) {
      const error = new Error('Failed to delete Announcement');
      error.statusCode = 500;
    }
    next(err);
  });
}

exports.deleteAnnouncements = (req,res,next) => {
    Employee.findByPk(req.id).then((user) => {
        if (!user.is_admin) {
          const error = new Error('Not authorized to delete announcements');
          error.statusCode = 401;
          throw error;
        }
      });
      const announcementId = req.params.id;
      Announcements.findByPk(announcementId)
        .then((announcement) => {
         
          return announcement.destroy();
        })
        .then(() => {
          res.status(200).json({ message: 'Announcement Deleted!' });
        })
        .catch((err) => {
          if (!err.statusCode) {
            const error = new Error('Failed to delete Announcement');
            error.statusCode = 500;
          }
          next(err);
        });
}


exports.addAnnouncements = (req,res,next) => {
  console.log("in method")
    const content = req.body.content;    
    const facilityId = req.params.id
    Employee.findByPk(req.id).then((user) => {
        if (!user.is_admin) {
          const error = new Error('Not authorized to add announcements');
          error.statusCode = 401;
          throw error;
        }
      });
Announcements.create({
facilityId: facilityId,
content: content
})
.then(announcement => {
    res.json({announcement: announcement})
})
.catch((err) => {
  if (!err.statusCode) {
    const error = new Error('Failed to delete Announcement');
    error.statusCode = 500;
  }
  next(err);
});
}