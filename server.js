const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./src/util/database');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet')


const Classroom = require('./models/classroom');
const Student = require('./models/student');
const Report = require('./models/report');
const Employee = require('./models/employee');
const Comments = require('./models/comments');
const Diapering = require('./models/diapering');
const Feeding = require('./models/feeding');
const Medicine = require('./models/medicine');
const Supplies = require('./models/supplies');
const Playtime = require('./models/playtime');
const Naptime = require('./models/naptime');
const Menu = require('./models/menu');
const Facility = require('./models/facility');
const Announcements = require('./models/announcements')


const app = express();
app.use(bodyParser.json());


app.use('/images', express.static(path.join(__dirname, 'images')));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log("saving file")
        console.log(Date.now().toString() + '-' + file.originalname)
cb(null,  Date.now().toString() + '-' + file.originalname)
    }
});


const filefilter = (req, file, cb) => {       
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false);
    };

}
app.use(multer({storage: fileStorage, fileFilter: filefilter}).single('image'));

app.use((req, res, next) => {   
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requeted-With, Content-Type, Accept, Authorization, uid, facilityId');
    next();
});


app.use(helmet())


const studentRoutes = require('./routes/student');
const classroomRoutes = require('./routes/classroom');
const reportRoutes = require('./routes/report');
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const facilityRoutes = require('./routes/facility')
const announceRoutes = require('./routes/announcements')


Report.hasMany(Feeding);
Report.hasMany(Diapering);
Report.hasMany(Comments);
Report.hasMany(Naptime);
Report.hasMany(Supplies);
Report.hasMany(Medicine);
Report.hasMany(Playtime);
Classroom.hasMany(Student);
Classroom.hasMany(Employee);
Student.hasMany(Report);
Facility.hasMany(Classroom);
Facility.hasMany(Student);
Facility.hasMany(Employee);
Facility.hasMany(Announcements);
Facility.hasMany(Menu)

app.use(studentRoutes);
 app.use(employeeRoutes);
 app.use(reportRoutes);
 app.use(classroomRoutes);
 app.use(authRoutes);
 app.use(menuRoutes);
 app.use(facilityRoutes);
 app.use(announceRoutes);

 // app.use(express.static(path.join(__dirname, './front-end/daycare-front-end/build')));
 // const clientRouter = express.Router();
 // forward any unmaped get requests to the client
// clientRouter.get('*', (request, response) => {
   
//     const pathToIndex = path.join(__dirname, './front-end/build', 'index.html');
    
//     console.log("path to index " ,pathToIndex)
//     response.sendFile(pathToIndex);
//   });

//   app.use('/', clientRouter);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});



 
sequelize
//.sync({force: true})
.sync()
   
.then(result => {
    app.listen(process.env.PORT || 8080);
})
.catch(err => {
    console.log(err)
});