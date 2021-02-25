const express = require('express');
const has = require('has-value');
const router = express.Router();
const bcrypt = require('bcrypt');
const Ajv = require('ajv').default;
const userJSON = require('../schemas/userSchema.json');
const postings = require('./postings')

//const fs = require('fs');


function validateJSONHeaders(req, res, next)
{
    if(req.get('Content-Type') === 'application/json')
    {
        next();
    }
    else
    {
        const err = new Error('Bad Request - Missing Headers');
        err.status = 400;
        next(err);
    }
}

let userData ={
    users:[    
    
    {
        userid: 1,
        firstName: "John",
        lastName: "Doe",
        address: "Street 1",
        phoneNumber: 352654,
        email: "john@email",
        password: "$2b$06$gUrQ8f/DBADGdnOfjXt.p.8VHZdozlJ6Ewj8l7OE/7FcOEtIfEriK"//testerPassword
    
    },    
    {
        userid: 2,
        firstName: "Jane",
        lastName: "Doe",
        address: "Street 1",
        phoneNumber: 352654,
        email: "jane@email",
        password: "$2b$06$j/YUYr2fkkFRn86YlzBVYePRzDD0lLQ0APZL55AZt/KTn.z2TR8Pa" //1234
    }
    ]
    
};

/* HTTP Basic Authentication using passport module */
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
    function(username, password, done) {        
        
        const user = userData.users.find(u => u.email === username);               
        if (user == undefined) {
            console.log("HTTP Basic username not found");
            return done (null, false, { message: "HTTP Basic username not found"});
        }    
        if(bcrypt.compareSync(password, user.password) == false) {
            console.log("HTTP Basic password not matching username");
            return done (null, false, { message: "HTTP Basic password not found"});
        }
        return done(null, user);
    }
));

/**
 * 
 * Here are the routes for the users path 
 * 
*/

/* Get list of all users */
router.get('/users', (req, res) => {    
    //res.json(userData.users);
    res.json(userData);
    console.log("User info sent")
});

/* Get user identified by userID */
router.get('/users/:userID',
            passport.authenticate('basic', { session: false}),
             (req, res) => {    
           
    const resultUser = userData.users.find(d => 
    {        
        if (d.userid == req.params.userID)
        {
            return true;
        }
        else
        {
            return false;
        }
    });        
    if (resultUser == undefined)
    {
        res.sendStatus(404);
        return;
    }
    else
    {
        //res.sendStatus(200);
        res.json(resultUser);
    }    
})

/* Middleware to validate new user JSON schema using ajv */
function validateJSONSchema(req, res, next) {
    const ajv = new Ajv();
    const validate = ajv.compile(userJSON);
    const valid = validate(req.body);
    if (!valid) {
        console.log(validate.errors);
        res.status(400)
        res.json(validate.errors);
        return;
    }
    res.status("OK");
    next();
}

/* Route to create a new user*/
router.post('/users', validateJSONSchema, (req, res) =>{
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 6);
    const newUser = {        
        userid: userData.users.length +1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: hashedPassword
    }
    userData.users.push(newUser);
    console.log("New user created with id " + newUser.userid);
    res.status(201);
    res.json(newUser);
    
});


module.exports = router;
