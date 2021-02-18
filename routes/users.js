const express = require('express');
const has = require('has-value');
const router = express.Router();

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
        phoneNumber: 2233565,
        email: "john@email",
        password: "1234"
    },
    {
        userid: 2,
        firstName: "Jane",
        lastName: "Doe",
        address: "Street 1",
        phoneNumber: 65265,
        email: "jane@email",
        password: "3654"
    }]
    
};

router.get('/users', (req, res) => {    
    res.json(userData.users);
    console.log("User info sent")
});

router.get('/users/:userID', (req, res) => {
    
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
    console.log(resultUser);    
    if (resultUser == undefined)
    {
        res.sendStatus(404);
    }
    else
    {
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
    next();
}

router.post('/users', [validateJSONHeaders, validateUser], (req, res) =>{
    const newUser = {        
        userid: userData.users.length +1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password
    }
    userData.users.push(newUser);
    console.log("New user created");
    res.status(201);
    res.json(newUser);
    
});

module.exports = router;
