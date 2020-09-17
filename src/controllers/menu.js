const Menu = require('../models/menu');
const { validationResult } = require('express-validator/check');
const Employee = require('../models/employee');


naturalCompare = (a,b) => {
  var ax = [], bx = [];
  console.log("class names")
console.log(a)
console.log(b)
  a.name.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
  b.name.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
  
  while(ax.length && bx.length) {
      var an = ax.shift();
      var bn = bx.shift();
      var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
      if(nn) return nn;
  }

  return ax.length - bx.length;
}
exports.getMenu = async(req, res, next) => {
  const id = req.get('uid');
  const facility = req.params.id;
  let isAdmin = false;
  try {
    const user = await Employee.findOne({ where: { id: id } })
    if (user.is_admin === true) {
      isAdmin = true;
    }

    let menuItems = {
      data: [
        { id: 3, name: 'Home', url: '/', level: 1, icon: 'Home' },
        {
          id: 1,
          name: 'Classrooms',
          url: null,
          level: 1,
          icon: 'School',
          children: [],
        },
  
        {
          id: 3,
          name: 'Report Archive',
          url: '/report/archive',
          level: 1,
          icon: 'Archive',
        },
      ],
    };

    const admin = {
      id: 2,
      name: 'Admin',
      url: null,
      level: 1,
      children: [
        {
          id: 4,
          name: 'Facility',
          url: '/admin/facility',
          level: 2,
        },
        {
          id: 4,
          name: 'Announcements',
          url: '/admin/announcements',
          level: 2,
        },
        {
          id: 5,
          name: 'Classroom',
          url: '/admin/classrooms',
          level: 2,
        },
        {
          id: 4,
          name: 'Students',
          url: '/admin/student',
          level: 2,
        },
        {
          id: 5,
          name: 'Employees',
          url: '/admin/employee',
          level: 2,
        },
      ],
    };

const menu = await   Menu.findAll({ where: { facilityId: facility }, order: [['name', 'ASC']] })
let classrooms = menu.filter((element) => {
  return element.parent_menu_item === 'Classrooms';
  
});
let sortedClassrooms = classrooms.sort((a,b) => {
  var ax = [], bx = [];
  a.name.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
  b.name.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
  
  while(ax.length && bx.length) {
      var an = ax.shift();
      var bn = bx.shift();
      var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
      if(nn) return nn;
  }

  return ax.length - bx.length;
})
for (i = 0; i <= classrooms.length - 1; i++) {
  menuItems.data[1].children.push(classrooms[i]);
}
if (isAdmin) {
  menuItems.data.splice(2, 0, admin);
}

res.json({ menuItems: menuItems });
  }
 
   catch(err) {
    if (!err.statusCode) {
      const error = new Error('Failed to get Menu');
      error.statusCode = 500;
    }
    next(err);
   }

  }



