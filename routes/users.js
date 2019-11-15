var fs = require('fs');
var express = require('express');
var router = express.Router();

// 1) MIDDLEWARE
router.use(express.json());

router.use((req, res, next) => {
  console.log(`Hello from the middleware!`);
  next();
});

router.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Local user data
var users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

// 2) ROUTE HANDLERS
// all users (GET)
var getAllUsers = function (req, res, next) {
  console.log(`Request timestamp: ` + req.requestTime);

  res.status(200).json(
    {
      status: "success",
      requestedAt: req.requestTime,
      results: users.length,
      data: {
        users: users
      }
    }
  );
}

// specific user (GET)
var getUser = function (req, res, next) {
  console.log(req.params);

  var id = req.params.id * 1;
  var user = users.find(element => element.id === id);
  if (!user) {
    return res.status(404).json(
      {
        status: "fail",
        message: "User not found"
      }
    );
  }
  res.status(200).json(
    {
      status: "success",
      data: {
        user
      }
    }
  );
}

// new user
var newUser = (req, res) => {
  // console.log(req.body);
  var newID = users[users.length - 1].id + 1;
  var newUser = Object.assign({ id: newID }, req.body);

  users.push(newUser);
  fs.writeFile(`${__dirname}/../dev-data/data/users.json`, JSON.stringify(users), err => {
    res.status(201).json({
      status: "success",
      data: {
        user: newUser
      }
    })
  });
}

// update user (PATCH)
var updateUser = (req, res) => {

  if (req.params.id * 1 > users.length) {
    return res.status(404).json(
      {
        status: "fail",
        message: "User not found"
      }
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      user: '<updated user here>'
    }
  })
}

// delete user
var deleteUser = (req, res) => {
  if (req.params.id * 1 > users.length) {
    return res.status(404).json(
      {
        status: "fail",
        message: "Not found"
      }
    );
  }

  res.status(204).json({
    status: "success",
    data: null
  })
}

// 3) ROUTES

router.param('id', (req, res, next, val) => {
  console.log(`Tour ID is:  ${val}`);
  next();
})

router.route('/')
  .get(getAllUsers)
  .post(newUser);


router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
