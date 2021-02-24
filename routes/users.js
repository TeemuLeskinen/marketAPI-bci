const express = require('express');
const has = require('has-value');
const router = express.Router();
const bcrypt = require('bcrypt');

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

router.get('/users', (req, res) => {    
    res.json(userData.users);
    console.log("User info sent")
});

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
    }
    else
    {
        //res.sendStatus(200);
        res.json(resultUser);
    }
    //console.log("Path working");
})

/* Middleware to handle new user validation */
function validateUser(req, res, next) {
    const err = new Error();
    err.name = "Bad Request";
    err.status = 400;
    if(has(req.body, 'firstName') == false)
    {
        err.message = "Missing your first name";
        next(err);
    }
    if(has(req.body, 'lastName') == false)
    {
        err.message = "Missing your last name";
        next(err);
    }
    if(has(req.body, 'address') == false)
    {
        err.message = "Missing your address";
        next(err);
    }
    if(has(req.body, 'phoneNumber') == false)
    {
        err.message = "Missing your phone number";
        next(err);
    }
    if(has(req.body, 'email') == false)
    {
        err.message = "Missing your email";
        next(err);
    }
    if(has(req.body, 'password') == false)
    {
        err.message = "Missing your password";
        next(err);
    }
    next();
}

/* Route for registering new users */
router.post('/users', [validateJSONHeaders, validateUser], (req, res) =>{
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
