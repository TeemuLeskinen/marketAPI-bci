const express = require('express');
const has = require('has-value');
const router = express.Router();
const bcrypt = require('bcrypt');
const Ajv = require('ajv').default;
const userJSON = require('../schemas/userSchema.json');
const postingJSON = require('../schemas/postingSchema.json');
const postings = require('./postings')
//const fs = require('fs');

let postingsData = {
    postings: [
        {
            id: 1,
            title: "iPhone 12",
            description: "6.1 display, 128Gt, 5G, iOS14",
            category: "phones",
            location: "Oulu",
            //image:
            price: 929,
            datePosted: "2021-2-14",
            deliveryType: "Delivery",
            sellerName: "John Doe",            
            email: "john@email",
            phoneNumber: 2233565

        },
        {
            id: 2,
            title: "OnePlus 8",
            description: "6.55 display, 128Gt, 5G, Android 10",
            category: "phones",
            location: "Oulu",
            //image:
            price: 799,
            datePosted: "2021-2-14",
            deliveryType: "Delivery",
            sellerName: "John Doe",            
            email: "john@email",
            phoneNumber: 2233565

        },
        {
            id: 3,
            title: "Macbook Air M1",
            description: "13.3 display, 512Gt SSD, 8Gt RAM, macOS Catalina",
            category: "computers",
            location: "Helsinki",
            //image:
            price: 1429,
            datePosted: "2021-2-14",
            deliveryType: "Delivery",
            sellerName: "John Doe",            
            email: "john@email",
            phoneNumber: 2233565

        }
    ]
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

/*********************************************
 This file consists all the routes for the api
**********************************************/


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

router.get('/', (req, res) => {
    res.sendFile(__dirname + '../html-document-generated/index.html');
})

/****************************************
 * Here are the routes for the users path
*****************************************/

/* Get list of all users */
router.get('/users', (req, res) => {
    if (userData == null) {
        res.status(404);
        console.log("Users not found");
    }
    else {
        res.json(userData);
        res.status(200);
        console.log("User info sent");
    }           
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
        res.status(200);
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

/*************************  
 * Routes to postings path
**************************/

//?startIndex=100&count=500
router.get('/postings', (req, res) => { 
    if (postingsData == null) {
        res.status(404);
        console.log("Postings not found");
        return;
    }
    else {
        res.json(postingsData);
        res.status(200);
        console.log("Postings sent sent");
    }   
    
})

/* Route for the searches. Search can be made by category, location or date.
Example HTTP request /postings/search?parameter=category&searchValue=phones */
router.get('/postings/search', (req, res) => {
    
    const param = req.query.parameter;
    console.log(param);
    const value = req.query.searchValue;
    const err = new Error();
    err.name = "Not found";
    err.status = 404;
    err.message = "Given parameter not found"

    if (param === 'category')
    {
        let results = postingsData.postings.filter(r => r.category === value);            
        console.log(results);   
        res.json(results);
        res.status(200);                  
        return;
    }
    if (param === 'location')
    {
        let results = postingsData.postings.filter(r => r.location === value);
        console.log(results);   
        res.json(results);
        res.status(200);        
        return;
    }
    if (param === 'date')
    {
        let results = postingsData.postings.filter(r => r.datePosted === value);
        console.log(results);   
        res.json(results);
        res.status(200);        
        return;
    }
    else
    {
        res.status(404);
        res.send(err); 
        console.log("Parameter not found");    
    }   
    
})

/* Middleware to validate new postings JSON schema using ajv */
function validatePostingsJSONSchema(req, res, next) {
    const ajv = new Ajv();
    const validate = ajv.compile(postingJSON);
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

//passport.authenticate('basic', { session: false}),
/* Route to make a new posting*/
router.post('/postings', validatePostingsJSONSchema, (req, res) =>{
    const newPosting = {
        id: postingsData.postings.length + 1,        
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        price: req.body.price,
        datePosted: req.body.datePosted,
        deliveryType: req.body.deliveryType,
        sellerName: req.body.sellerName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    }
    postingsData.postings.push(newPosting);

    res.status(201, {message: "New posting created"});
    res.json(newPosting);
    console.log(newPosting);
})

/* Route to edit title of the posting */
router.put('/postings/:id',passport.authenticate('basic', { session: false}), (req, res) =>{       
    const data = req.params.id;
    const postingId = postingsData.postings.find(p => p.id == req.params.id);
    const newTitle = req.body.title;
    if(postingId == undefined)
    {
        res.sendStatus(400);        
        return;
    } 
    else
    {
        postingId.title = newTitle;      
        console.log(postingId);    
        res.sendStatus(200);
    }
})

/* Route to delete a posting */
router.delete('/postings/:id', passport.authenticate('basic', { session: false}), (req, res)  => {
    postingsData.postings = postingsData.postings.filter(postings => postings.id != req.params.id);    
    res.sendStatus(200);
})

module.exports = router;
