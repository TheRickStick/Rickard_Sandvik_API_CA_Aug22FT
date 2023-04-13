var express = require('express');
var jwt = require('jsonwebtoken')
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var crypto = require('crypto');
var UserService = require("../services/UserService");
var userService = new UserService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
router.use(jsend.middleware);

router.post("/signup", async (req, res, next) => {
    const { name, email, password } = req.body;
    if (name == null) {
      return res.jsend.fail({"name": "Name is required."});
    }
    if (email == null) {
      return res.jsend.fail({"email": "Email is required."});
    }
    if (password == null) {
      return res.jsend.fail({"password": "Password is required."});
    }
    var user = await userService.getOne(email);
    if (user != null) {
      return res.jsend.fail({"email": "Provided email is already in use."});
    }
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return next(err); }
      userService.create(name, email, hashedPassword, salt)
      res.jsend.success({"result": "You created an account."});
    });
});

router.post("/login", jsonParser, async (req, res, next) => {
    const { email, password } = req.body;
    if (email == null) {
      return res.jsend.fail({"email": "Email is required."});
    }
    if (password == null) {
      return res.jsend.fail({"password": "Password is required."});
    }
    userService.getOne(email).then((data) => {
        if(data === null) {
            return res.jsend.fail({"result": "Incorrect email or password"});
        }
        crypto.pbkdf2(password, data.Salt, 310000, 32, 'sha256', function(err, hashedPassword) {
          if (err) { return cb(err); }
          if (!crypto.timingSafeEqual(data.EncryptedPassword, hashedPassword)) {
              return res.jsend.fail({"result": "Incorrect email or password"});
          }
          let token;
          try {
            token = jwt.sign(
              { id: data.id, email: data.Email },
              process.env.TOKEN_SECRET,
              { expiresIn: "1h" }
            );
          } catch (err) {
            res.jsend.error("Something went wrong with creating JWT token")
          }
          res.jsend.success({"result": "You are logged in", "id": data.id, email: data.Email, token: token});
        });
    });
});

module.exports = router;