const Menu = require('../models/menu');
const { validationResult } = require('express-validator/check');

exports.getMenu = (req, res, next) => {
  console.log("in menu backend")
  let menuItems = {
    data: [
      { id: 3, name: 'Home', url: '/' },
      { id: 1, name: 'Classrooms', url: null, children: [

      ] },
      {
        id: 2,
        name: 'Admin',
        url: null,
        children: [
          {
            id: 4,
            name: 'Facility',
            url: null,
            children: [{ id: 7, name: 'Update', url: '/facility/update' }],
          },
          {
            id: 4,
            name: 'Announcements',
            url: null,
            children: [{ id: 7, name: 'Add', url: '/announcements/add' },
            { id: 7, name: 'Update', url: '/announcements/update' },
            { id: 8, name: 'Delete', url: '/announcements/delete' }
          ],
          },
          {
            id: 5,
            name: 'Classrooms',
            url: null,
            children: [
              { id: 6, name: 'Add', url: '/classroom/add' },
              { id: 7, name: 'Update', url: '/classroom/update' },
              { id: 8, name: 'Delete', url: '/classroom/delete' },
            ],
          },
          {
            id: 4,
            name: 'Students',
            url: null,
            children: [
              { id: 6, name: 'Add', url: '/student/add' },
              { id: 7, name: 'Update', url: '/student/update' },
              { id: 8, name: 'Delete', url: '/student/delete' },
            ],
          },
          {
            id: 5,
            name: 'Employees',
            url: null,
            children: [
              { id: 6, name: 'Add', url: '/employee/add' },
              { id: 7, name: 'Update', url: '/employee/update' },
              { id: 8, name: 'Delete', url: '/employee/delete' },
            ],
          },
        ],
      },
      { id: 3, name: 'Report Archive', url: '/report/archive' },
    ],
  };

  Menu.findAll({where: {facilityId: req.params.id}})
    .then((menu) => {
      let classrooms = menu.filter((element) => {
        return element.parent_menu_item === 'Classrooms';
      });
      console.log(classrooms);
      for (i = 0; i <= classrooms.length - 1; i++) {
        menuItems.data[0].children.push(classrooms[i]);
      }

      res.json({ menuItems: menuItems });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error('Failed to get Menu');
        error.statusCode = 500;
      }
      next(err);
    });
};
