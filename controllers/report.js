const Report = require('../models/report');
const Feeding = require('../models/feeding');
const Diapering = require('../models/diapering');
const Playtime = require('../models/playtime');
const Naptime = require('../models/naptime');
const Supplies = require('../models/supplies');
const Medicine = require('../models/medicine');
const Comment = require('../models/comments');

exports.getReport = (req, res, next) => {
  const reportId = req.params.id;
  Report.findByPk(reportId, {include: ['feedings', 'diaperings', 'comments', 'supplies', 'naptimes', 'playtimes', 'medicines']})
    .then((report) => {
      res.status(200).json({
        report: report,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to get Report");
        error.statusCode = 500;
      }
      next(err);
    });
};

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

exports.createFeeding = (req, res, next) => {
  const time = req.body.time;
  const amount = req.body.amount;
  const food = req.body.food;
  const reportId = req.body.reportId;
  Feeding.create({
    amount: amount,
    food: food,
    time: time,
    reportId: reportId,
  })
    .then((feeding) => {
      res.status(201).json({ feeding: feeding });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to create Feeding");
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.editFeeding = (req, res, next) => {
  const feedingId = req.params.id;
  const updatedAmount = req.body.amount;
  const updatedFood = req.body.food;
  const updatedTime = req.body.time;
  Feeding.findByPk(feedingId)
    .then((feeding) => {
      feeding.time = updatedTime;
      feeding.food = updatedFood;
      feeding.amount = updatedAmount;
      return feeding.save().then((feeding) => {
        res.status(201).json({ feeding: feeding, message: 'Feeding updated' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("failed to update feeding")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteFeeding = (req, res, next) => {
  const feedingId = req.params.id;
  Feeding.findByPk(feedingId)
    .then((feeding) => {
      return feeding.destroy().then((result) => {
        res.status(200).json({ message: 'Feeding deleted' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("failed to delete feeding")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.createDiapering = (req, res, next) => {
  const time = req.body.time;
  const type = req.body.type;
  const reportId = req.body.reportId;
  Diapering.create({
    type: type,
    time: time,
    reportId: reportId,
  })
    .then((diapering) => {
      res.status(201).json({ diapering: diapering });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("failed to create diapering")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.editDiapering = (req, res, next) => {
  const diaperingId = req.params.id;
  const updatedType = req.body.type;
  const updatedTime = req.body.time;
  Diapering.findByPk(diaperingId)
    .then((diapering) => {
      diapering.time = updatedTime;
      diapering.type = updatedType;
      return diapering.save().then((diapering) => {
        res
          .status(201)
          .json({ diapering: diapering, message: 'Diapering updated' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("failed to update diapering")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteDiapering = (req, res, next) => {
  const diaperingId = req.params.id;
  Diapering.findByPk(diaperingId)
    .then((diapering) => {
      return diapering.destroy()
      .then((result) => {
        res.status(200).json({ message: 'Diapering deleted' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to delete diapering")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.createComment = (req, res, next) => {
  const comment = req.body.comment;
  const reportId = req.body.reportId;
  Comment.create({
    comment: comment,
    reportId: reportId,
  })
    .then((comment) => {
      res.status(201).json({ comment: comment });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to create Comment")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.editComment = (req, res, next) => {
  const commentId = req.params.id;
  const updatedComment = req.body.comment;
  Comment.findByPk(commentId)
    .then((comment) => {
      comment.comment = updatedComment;

      return comment.save().then((comment) => {
        res.status(201).json({ comment: comment, message: 'Comment updated' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to update Comment")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.id;
  Comment.findByPk(commentId)
    .then((comment) => {
      return comment.destroy().then((result) => {
        res.status(200).json({ message: 'Comment deleted' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to delete Comment")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.createMedicine = (req, res, next) => {
  const time = req.body.time;
  const reportId = req.body.reportId;
  const name = req.body.name;
  const dosage = req.body.dosage;
  Medicine.create({
    dosage: dosage,
    reportId: reportId,
    time: time,
    name: name,
  })
    .then((medicine) => {
      res.status(201).json({ medicine: medicine });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to create Medicine")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.editMedicine = (req, res, next) => {
  const medicineId = req.params.id;
  const updatedDosage = req.body.dosage;
  const updatedName = req.body.name;
  const updatedTime = req.body.time;
  Medicine.findByPk(medicineId)
    .then((medicine) => {
      medicine.time = updatedTime;
      medicine.dosage = updatedDosage;
      medicine.name = updatedName;
      return medicine.save().then((medicine) => {
        res
          .status(201)
          .json({ medicine: medicine, message: 'Medicine updated' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to update Medicine")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteMedicine = (req, res, next) => {
  const medicineId = req.params.id;
  Medicine.findByPk(medicineId)
    .then((medicine) => {
      return medicine.destroy().then((result) => {
        res.status(200).json({ message: 'Medicine deleted' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to delete Medicine")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.createPlaytime = (req, res, next) => {
  const reportId = req.body.reportId;
  const activity = req.body.activity;

  Playtime.create({
    activity: activity,
    reportId: reportId,
  })
    .then((activity) => {
      res.status(201).json({ activity: activity });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to create Play time")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.editPlaytime = (req, res, next) => {
  const playtimeId = req.params.id;
  const updateActivity = req.body.activity;
  Playtime.findByPk(playtimeId)
    .then((playtime) => {
      playtime.activity = updateActivity;

      return playtime.save().then((playtime) => {
        res
          .status(201)
          .json({ playtime: playtime, message: 'Play time updated' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to update Play time")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePlaytime = (req, res, next) => {
  const playtimeId = req.params.id;
  Playtime.findByPk(playtimeId)
    .then((playtime) => {
      return playtime.destroy().then((result) => {
        res.status(200).json({ message: 'Play time deleted' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to delete Play time")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.createNaptime = (req, res, next) => {
  const startTime = req.body.start_time;
  const reportId = req.body.reportId;
  const endTime = req.body.end_time;
  Naptime.create({
    start_time: startTime,
    reportId: reportId,
    end_time: endTime,
  })
    .then((naptime) => {
      res.status(201).json({ naptime: naptime });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to create Nap time")

        error.statusCode = 500;
      }
      next(err);
    });
};

exports.editNaptime = (req, res, next) => {
  const napId = req.params.id;
  const updatedStartTimet = req.body.amount;
  const updatedEndTime = req.body.food;
  Naptime.findByPk(napId)
    .then((naptime) => {
      naptime.time = updatedStartTimet;
      naptime.food = updatedEndTime;

      return naptime.save().then((naptime) => {
        res.status(201).json({ naptime: naptime, message: 'Naptime updated' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to update Nap time")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteNaptime = (req, res, next) => {
  const napId = req.params.id;
  Naptime.findByPk(napId)
    .then((naptime) => {
      return naptime.destroy().then((result) => {
        res.status(200).json({ message: 'Nap Time deleted' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to delete Nap time")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.createSupplies = (req, res, next) => {
  const supplyItem = req.body.supply_item;
  const reportId = req.body.reportId;
  Supplies.create({
    supply_item: supplyItem,
    reportId: reportId,
  })
    .then((supplyItem) => {
      res.status(201).json({ supply_item: supplyItem });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to create Supply item")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.editSupplies = (req, res, next) => {
  const supplyId = req.params.id;
  const updatedSupplyItem = req.body.supply_item;
  Supplies.findByPk(supplyId)
    .then((supplyItem) => {
      supplyItem.supply_item = updatedSupplyItem;

      return supplyItem.save()
      .then((supplyItem) => {
        res.status(201)
          .json({ supply_item: supplyItem, message: 'Supplies updated' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to update supply item")
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteSupplies = (req, res, next) => {
  const supplyId = req.params.id;
  Supplies.findByPk(supplyId)
    .then((supplyItem) => {
      return supplyItem.destroy().then((result) => {
        res.status(200).json({ message: 'Supply Item deleted' });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Failed to delete supply item")
        error.statusCode = 500;
      }
      next(err);
    });
};
