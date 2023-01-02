//M.Rajkaran
//2109039
//DIT/FT/1B/02
var express = require('express');
var app = express();
var actor = require('../model/actor.js');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());// parse application/json
app.use(urlencodedParser); // parse application/x-www-form-urlencoded

//Endpoint 1 (Done)
app.get('/actors/:actor_id', function (req, res) {
    var actor_id = req.params.actor_id;
    actor.getActor(actor_id, function (err, result) {
        if (!err) {
            if (result.length == 0) {
                res.status(204).send("No Content. Record of given actor_id cannot be found.");
            } else {
                res.status(200).send(result);
            }
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg);
        }
    });
});

//Endpoint 2

app.get('/actors', function (req, res) {
    var limit = parseInt(req.query.limit) || 20;
    var offset = parseInt(req.query.offset) || 0;
    actor.getActors(limit, offset, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            let response = { "error_msg": "Internal server error" };
            res.status(500).send(response);
        }


    })
})

//Endpoint 3

app.post('/actors', function (req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    actor.newActor(first_name, last_name, function (err, result) {
        if (first_name == undefined || last_name == undefined) {
            let msg = { "error_msg": "missing data" }
            res.status(400).send(msg)
        } else {
            if (!err) {
                var actid = { actor_id: ' ' + result.insertId }
                res.status(201).send(actid)
            } else {
                let msg = { "error_msg": "Internal server error" }
                res.status(500).send(msg);
            }
        }
    })

})

//Endpoint 4(done) change
app.put('/actors/:actor_id', function (req, res) {
    var actor_id = req.params.actor_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    if (first_name === undefined && last_name === undefined) {
        let msg = { "error_msg": "missing data" }
        res.status(400).send(msg)
    } else {
        actor.updateName(first_name, last_name, actor_id, function (err, result) {
            if (result == 0) {
                res.status(204).send("No Content. Record of given actor_id cannot be found.");
            } else {
                if (!err) {
                    var succ = { "success_msg": "record updated" }
                    res.status(200).send(succ);
                } else {
                    let msg = { "error_msg": "Internal server error" }
                    res.status(500).send(msg);
                }
            }
        })
    }
})


//Endpoint 5
app.delete('/actors/:actor_id', function (req, res) {
    var actor_id = req.params.actor_id;

    actor.deleteActor(actor_id, actor_id, function (err, result) {

        if (result == 0) {
            res.status(204).send("No Content. Record of given actor_id cannot be found.");
        }
        if (!err) {
            let succ = { "success_msg": "actor deleted" }
            res.status(200).send(succ);
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg)
        }

    })


})

//Endpoint 6

app.get('/film_categories/:catergory_id/films', function (req, res) {
    var catergory_id = req.params.catergory_id;

    actor.getFilmbyCategory(catergory_id, function (err, result) {
        if (!err) {
            if (result == 0) {
                res.status(204).send("No Content. Record of given actor_id cannot be found.");
            } else {

                res.status(200).send(result);
            }
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg)
        }
    })


})


//Endpoint 7

app.get('/customer/:customer_id/payment', function (req, res) {
    var customer_id = req.params.customer_id;
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;

    actor.getPaymentDetail(start_date, end_date, customer_id, function (err, result) {
        if (!err) {
            var data = JSON.parse(JSON.stringify(result));
            var total = 0;
            for (var i = 0; i < data.length; i++) {
                // to addup total amt
                total += data[i].amount;
            }
            if (total == 0) {
                total = 0;
            }
            else {
                total = total.toFixed(2);
            }
            let msg = { "rental": result, "total": total + "" };
            res.status(200).send(msg);
        }
        else {
            let msg = { "error_msg": "Internal server error" };
            res.status(500).send(msg);
        }
    })

})



//Endpoint 8
app.post('/customers', function (req, res) {

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var store_id = req.body.store_id;
    var email = req.body.email;
    var address = req.body.address;

    actor.addCustomerAddress(address, function (err, result) {
        if (!err) {
            let selectID = result;
            actor.addCustomer(store_id, first_name, last_name, email, selectID, function (err, result) {
                if (!err) {
                    let msg = { "customer_id": result + "" };
                    res.status(201).send(msg);
                } else {
                    if (store_id == undefined || first_name == undefined || last_name == undefined || email == undefined) {
                        //check for missing data
                        let msg = { "error_msg": "missing data" };
                        res.status(400).send(msg);
                    } else if (err.code == 'ER_DUP_ENTRY') {
                        //checking for duplicate entry
                        let msg = { "error_msg": "email already exist" };
                        res.status(409).send(msg);
                    } else {
                        let msg = { "error_msg": "Internal server error" };
                        res.status(500).send(msg);
                    }
                }
            })
        } else {
            if (address.address_line1 == undefined || address.address_line2 == undefined || address.district == undefined || address.city_id == undefined || address.postal_code == undefined || address.phone == undefined) {
                let msg = { "error_msg": "missing data" };
                res.status(400).send(msg);
            } else {
                let msg = { "error_msg": "Internal server error" };
                res.status(500).send(msg);
            }
        }

    })
})

// extra endpoint
app.post('/country', function (req, res) {
    var country = req.body.country
    var city = req.body.city
    actor.addCountry(country, function (err, result) {
        if (!err) {
            let countryID = result;

            actor.addCity(city, countryID, function (err, result) {
                if (!err) {
                    let msg = { "city_id": result.insertId + "" }
                    res.status(201).send(msg)
                } else {
                    let msg = { "error_msg": "Internal server error" }
                    res.status(500).send(msg);
                }
            })

        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg);
        }

    })

})



module.exports = app



