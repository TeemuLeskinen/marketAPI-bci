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

postingsRouter.get('/')


module.exports = postingsRouter;