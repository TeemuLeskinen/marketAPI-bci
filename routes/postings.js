const express = require('express');
const has = require('has-value');
const postingsRouter = express.Router();


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

//?startIndex=100&count=500
postingsRouter.get('/postings', (req, res) => {
    //res.json(postingsData.postings);
    res.json(postingsData);
    console.log("Postings sent");
})

/* Route for the searches. Search can be made by category, location or date.
Example HTTP request /postings/search?parameter=category&searchValue=phones */
postingsRouter.get('/postings/search', (req, res, next) => {
    
    const param = req.query.parameter;
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
        next();
    }
    if (param === 'location')
    {
        let results = postingsData.postings.filter(r => r.location === value);
        console.log(results);   
        res.json(results);
        res.status(200);
        next();
    }
    if (param === 'date')
    {
        let results = postingsData.postings.filter(r => r.datePosted === value);
        console.log(results);   
        res.json(results);
        res.status(200);
        next();
    }

    else
    {
        next(err);
    }   
    
})

/* Route to make a new posting*/
postingsRouter.post('/postings',(req, res) =>{
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


postingsRouter.put('/postings/:id',(req, res) =>{

    
    const data = postingsData.postings.find(d => d.id === req.params.id);
    const mod = req.body
    console.log(mod);
    res.sendStatus(200);
})

/* Route to delete a posting */
postingsRouter.delete('/postings/:id', (req, res) => {
    postingsData.postings = postingsData.postings.filter(postings => postings.id != req.params.id);
    
    res.sendStatus(200);
})


module.exports = postingsRouter;