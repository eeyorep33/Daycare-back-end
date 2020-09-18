const Report = require('../models/report');
const Feeding = require('../models/feeding');
const Diapering = require('../models/diapering');
const Playtime = require('../models/playtime');
const Naptime = require('../models/naptime');
const Supplies = require('../models/supplies');
const Medicine = require('../models/medicine');
const Comment = require('../models/comments');
const Student = require('../models/student')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const moment = require('moment')

exports.getReport = async (req, res, next) => {
  let studentId= req.params.id
  try {
 let start = moment().startOf('day')
let end = moment().endOf('day')
    const report = await Report.findOne({include:['feedings', 'diaperings', 'comments', 'supplies', 'naptimes', 'playtimes', 'medicines'], 
    where: {createdAt: {[Op.gt]: start, [Op.lt]: end}, studentId: studentId}})   
    const student = await Student.findByPk(studentId)
    res.status(200).json({report: report,
      student: student
    });
  }  
      catch(err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
       }
};


exports.getArchiveReport = async(req,res, next) => {
  const reportId = req.params.id
try {
  const report = await Report.findOne({order:[['createdAt', 'DESC']],include:['feedings', 'diaperings', 'comments', 'supplies', 'naptimes', 'playtimes', 'medicines'], 
    where: {id:  reportId}})  
    const student = await Student.findByPk(report.studentId)

    res.json({report: report, student: student})
}
catch(err) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
 }
}


exports.getReportList = async (req,res,next) => {
  let studentId= req.params.id
  try {
    const report = await Report.findAll({order:[['createdAt', 'DESC']],include:['feedings', 'diaperings', 'comments', 'supplies', 'naptimes', 'playtimes', 'medicines'], 
    where: {studentId:  studentId}})   
    res.json({reportList: report})
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
}




exports.createReport = (req, res, next) => {
  Report.create().then((report) => {
    res.status(201).json({
      report: report,
      message: 'Report created',
    });
  })
  .catch((err) => {
    if (!err.statusCode) {
      const error = new Error("Failed to create Report");
      error.statusCode = 500;
    }
    next(err);
  });
};

exports.createFeeding = async (req, res, next) => {
  const time = req.body.time; 
  const amount = req.body.amount;
  const food = req.body.food;
  const reportId = req.body.reportId;
  try {
    const feeding = await Feeding.create({
      amount: amount,
      food: food,
      time: time,
      reportId: reportId,
    })
    res.status(201).json({ feeding: feeding });
  }  
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.editFeeding = async (req, res, next) => {
  const feedingId = req.params.id;
  const updatedAmount = req.body.amount;
  const updatedFood = req.body.food;
  const updatedTime = req.body.time;
  try{
    const feeding = await  Feeding.findByPk(feedingId)
    feeding.time = updatedTime;
    feeding.food = updatedFood;
    feeding.amount = updatedAmount;
    const updatedFeeding = await feeding.save()
    res.status(201).json({ feeding: updatedFeeding, message: 'Feeding updated' });
  }    
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.deleteFeeding = async (req, res, next) => {
  const feedingId = req.params.id;
  try {
    const feeding = await Feeding.findByPk(feedingId)
    const result = await feeding.destroy()    
    res.status(200).json({feeding: feeding, message: 'Feeding deleted' });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.createDiapering = async (req, res, next) => {
  const time = req.body.time;
  const type = req.body.type;
  const reportId = req.body.reportId;
  try {
    const diapering = await  Diapering.create({
      type: type,
      time: time,
      reportId: reportId,
    })
    res.status(201).json({ diapering: diapering });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.editDiapering = async (req, res, next) => {
  const diaperingId = req.params.id;
  const updatedType = req.body.type;
  const updatedTime = req.body.time;
  try {
    const diapering = await  Diapering.findByPk(diaperingId)
    diapering.time = updatedTime;
    diapering.type = updatedType;
    const updatedDiapering = await diapering.save()
    res.status(201).json({ diapering: updatedDiapering, message: 'Diapering updated' });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.deleteDiapering = async (req, res, next) => {
  const diaperingId = req.params.id;
try {
  const diapering = await  Diapering.findByPk(diaperingId)
const result = await diapering.destroy()
res.status(200).json({diapering: diapering, message: 'Diapering deleted' });
}
catch(err) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
 }
};

exports.createComment = async (req, res, next) => {
  const com = req.body.comment;
  const reportId = req.body.reportId;
  try {
    const comment = await Comment.create({
      comment: com,
      reportId: reportId,
    })
    res.status(201).json({ comment: comment });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.editComment = async (req, res, next) => {
  const commentId = req.params.id;
  const updatedCom = req.body.comment;
  try {
    const comment = await   Comment.findByPk(commentId)
    comment.comment = updatedCom;
    const updatedComment = await comment.save()
    res.status(201).json({ comment: updatedComment, message: 'Comment updated' });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.deleteComment = async (req, res, next) => {
  const commentId = req.params.id;
  try {
    const comment = await  Comment.findByPk(commentId)
    const result = await comment.destroy()
    res.status(200).json({comment: comment, message: 'Comment deleted' });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.createMedicine = async (req, res, next) => {
  const time = req.body.time;
  const reportId = req.body.reportId;
  const name = req.body.name;
  const dosage = req.body.dosage;
  try {
    const meds = await Medicine.create({
      dosage: dosage,
      reportId: reportId,
      time: time,
      name: name,
    })
    res.status(201).json({ medicine: meds });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.editMedicine = async (req, res, next) => {
  const medicineId = req.params.id;
  const updatedDosage = req.body.dosage;
  const updatedName = req.body.name;
  const updatedTime = req.body.time;
  try {
    const meds = await  Medicine.findByPk(medicineId)
    meds.time = updatedTime;
    meds.dosage = updatedDosage;
    meds.name = updatedName;
    const updatedMeds = await meds.save()
    res.status(201).json({ medicine: updatedMeds, message: 'Medicine updated' });

  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.deleteMedicine = async (req, res, next) => {
  const medicineId = req.params.id;
  try {
    const meds = await Medicine.findByPk(medicineId)
const result = await meds.destroy()
res.status(200).json({medicine: meds, message: 'Medicine deleted' });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.createPlaytime = async (req, res, next) => {
  const reportId = req.body.reportId;
  const activity = req.body.activity;
try {
  const playtime =await Playtime.create({
    activity: activity,
    reportId: reportId,
  })
  res.status(201).json({ playtime: playtime });
}
catch(err) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
 }
};

exports.editPlaytime = async (req, res, next) => {
  const playtimeId = req.params.id;
  const updateActivity = req.body.activity;
  try {
    const playtime = await   Playtime.findByPk(playtimeId)
    playtime.activity = updateActivity;
    const updatedPlaytime = await playtime.save()
    res.status(201).json({ playtime: updatedPlaytime, message: 'Play time updated' });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.deletePlaytime = async(req, res, next) => {
  const playtimeId = req.params.id;
  try {
    const playtime = await   Playtime.findByPk(playtimeId)
    const result = await playtime.destroy()
    res.status(200).json({playtime: playtime, message: 'Play time deleted' });

  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.createNaptime = async (req, res, next) => {
  const startTime = req.body.start_time;
  const reportId = req.body.reportId;
  const endTime = req.body.end_time;
  try {
    const naptime = await  Naptime.create({
      start_time: startTime,
      reportId: reportId,
      end_time: endTime,
    })
    res.status(201).json({ naptime: naptime });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.editNaptime = async (req, res, next) => {
  const napId = req.params.id;
  const updatedStartTime = req.body.start_time;
  const updatedEndTime = req.body.end_time;
  console.log("end")
  console.log(updatedEndTime)
  console.log("start")
  console.log(updatedStartTime)

  try {
    const naptime = await Naptime.findByPk(napId)    
    naptime.start_time = updatedStartTime;
    naptime.end_time = updatedEndTime;
    const updatedNaptime = await naptime.save()
    res.status(201).json({ naptime: updatedNaptime, message: 'Naptime updated' });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.deleteNaptime = async (req, res, next) => {
  const napId = req.params.id;
  try {
    const naptime = await  Naptime.findByPk(napId)
const result = await naptime.destroy()
res.status(200).json({ naptime: naptime, message: 'Nap Time deleted' });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.createSupplies = async (req, res, next) => {
  const supplyItem = req.body.supply_item;
  const reportId = req.body.reportId;
  try {
    const supplies = await Supplies.create({
      supply_item: supplyItem,
      reportId: reportId,
    })
    res.status(201).json({ supply: supplies });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.editSupplies = async (req, res, next) => {
  const supplyId = req.params.id;
  const updatedSupplyItem = req.body.supply_item;
  try {
    const supplies = await  Supplies.findByPk(supplyId)
    supplies.supply_item = updatedSupplyItem;
    const updatedSupplies  =  await supplies.save()
    res.status(201).json({ supply: updatedSupplies, message: 'Supplies updated' });
 
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};

exports.deleteSupplies = async (req, res, next) => {
  const supplyId = req.params.id;
  try {
    const supplies = await   Supplies.findByPk(supplyId)
const result = await supplies.destroy()
res.status(200).json({ supply: supplies, message: 'Supply Item deleted' });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   }
};


