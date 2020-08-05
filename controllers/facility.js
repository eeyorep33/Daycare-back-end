const Facility = require('../models/facility');
const bcrypt = require('bcrypt');

exports.signup = (req,res,next) => {
    const name = req.body.name;
    const email = req.body.email;
    const adminName = req.body.adminName;
    const adminEmail = req.body.adminEmail;
    const userName = req.body.userName;
    const password = req.body .password;

    Facility.findOne({where: {name: name}}).then(facility => {
        if(facility) {
          return  res.json({message: "Facility already exists"})
        }
    })

    Facility.create({
        name: name,
        email: email
    }).then(facility => {
        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            facility.createEmployee({
                name: adminName,
                email: adminEmail,
                userName: userName,
                password: hashedPassword,
                is_active: true,
                is_admin: true,
                checked_in:false
            }).then(result => {
                res.json({message: "Facility enrolled"})
            })
        })
    }

    ) .catch((err) => {
        if (!err.statusCode) {
          const error = new Error('Failed to create Facility');
          error.statusCode = 500;
        }
        next(err);
      });
    
}