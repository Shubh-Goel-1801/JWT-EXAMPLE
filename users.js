var express = require('express');
var router = express.Router();
const User = require('../controllers/user.controller');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');

router.post('/signup', body('name').notEmpty(), (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        next();
    }

   return  res.send({ errors: result.array() });

}, User.registration);

router.post("/login", User.login)

router.use((req, res, next) => {
    try {
        let token = req.headers.authorization;
        let result = jwt.verify(token, 'shhhhh');
        req.user = result;
        next();
    } catch (error) {
        return res.json({
            message: 'Please login again!'
        });
    }

})

router.get('/fetch', User.getAddresses);
router.post('/create', User.addAddress);
router.put('/update', User.updateAddress);
router.delete('/delete', User.deleteAddress);
router.get("/profile", User.getProfile)


module.exports = router;