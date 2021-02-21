const express = require('express');
const has = require('has-value');
const postingsRouter = express.Router();


let postingsData = {
    postings: [
        {
            id: 1,
            title: "iPhone 12",
            description: "6.1 display, 128Gt, 5G, iOS14",
            category: "Phones",
            location: "Oulu",
            //image:
            price: 929,
            datePosted: "2021-2-14",
            deliveryType: "Delivery",
            sellerName: "John Doe",
            userId: 1,
            email: "john@email",
            phoneNumber: 2233565

        },
        {
            id: 2,
            title: "OnePlus 8",
            description: "6.1 display, 128Gt, 5G, Android 12",
            category: "Phones",
            location: "Oulu",
            //image:
            price: 799,
            datePosted: "2021-2-14",
            deliveryType: "Delivery",
            sellerName: "John Doe",
            userId: 2,
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
    res.json(postingsData.postings);
    console.log("Postings sent");
})

//search?parameter=category&searchValue=phones
postingsRouter.get('/postings/search',(req, res) => {
    
    console.log("Route working");    
    
    const param = req.query.parameter;
    const result = req.query.searchValue;
    const p = "hello";
    if (param === "category" && result === "phones")
    {

        console.log("I'm here " + param ," " + result);
    }
    else
        console.log("Wrong parameter");

    //res.json(param + result);    
    //console.log(param);
    //res.json(category);
    //console.log(category);
                
    /*const resultCategory = postingsData.postings.find(d => {
        if (d.category == req.query.searchValue)
        {
            return true
        }
        else
        {
            return false
        }
        });
        res.json(resultCategory);


        
        console.log(resultCategory);*/
})


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

    res.status(201);
    res.json(newPosting);
    console.log(newPosting);
})

postingsRouter.put('/postings/:id',(req, res) =>{
    const data = postingsData.postings.filter(postings => postings.id != req.params.id);
    console.log(data);
    res.sendStatus(200);
})

postingsRouter.delete('/postings/:id', (req, res) => {
    postingsData.postings = postingsData.postings.filter(postings => postings.id != req.params.id);
    
    res.sendStatus(200);
})


module.exports = postingsRouter;