//M.Rajkaran
//2109039
//DIT/FT/1B/02
var express = require('express');
var app = express();
var actor = require('../model/actor.js');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const verifyToken = require("../auth/verifyToken");
const cors = require("cors");
app.use(cors());


app.use(bodyParser.json());// parse application/json
app.use(urlencodedParser); // parse application/x-www-form-urlencoded


//admin login
app.post("/login", (req, res) => {
    actor.verify(
        req.body.email,
        req.body.password,
        (error, user) => {
            if (error) {
                res.status(500).send();
                return;
            }
            if (user === null) {
                res.status(401).send();
                return;
            }
            const payload = { user_id: user.id };
            jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
                if (error) {
                    console.log(error);
                    res.status(401).send();
                    return;
                }
                res.status(200).send({
                    token: token,
                    user_id: user.id
                });
            })
        });
});


//search by title
app.get('/searchbytitle', function (req, res) {
    const title = req.query.title;
    const price = req.query.price || 5
    actor.searchByTitle(title, price, function (err, result) {
        if (!err) {
            console.log(result)
            res.status(200).send(result);
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg);
        }
    })
})


// to get actors of respective films
app.get('/filmactors/:film_id', function (req, res) {
    const film_id = req.params.film_id
    actor.searchActors(film_id, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg);
        }
    })

})

app.get('/film/:film_id', function (req, res) {
    const film_id = req.params.film_id
    actor.getMovieById(film_id, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg);
        }
    })
})

//Populate dropdowns
app.get('/film-categories', function (req, res) {
    actor.getCategories(function (err, result) {
        if (!err) {
            res.status(200).send(result)
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg);
        }

    })

})

app.get('/city', function (req, res) {
    actor.getCities(function (err, result) {
        if (!err) {
            res.status(200).send(result)
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg);
        }

    })
})

app.get('/store', function (req, res) {

    actor.getStores(function (err, result) {
        if (!err) {
            res.status(200).send(result)
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg);
        }
    })


})

app.get('/actorSelect', function (req, res) {

    actor.getActorSelect(function (err, result) {
        if (!err) {
            res.status(200).send(result)
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg);
        }
    })

})



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

app.post('/actors', verifyToken, function (req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    if (first_name.trim() == "" && last_name.trim() == "") {
        let msg = { "error_msg": "missing data" }
        res.status(500).send(msg)
    } else {
        actor.newActor(first_name, last_name, function (err, result) {
            if (!err) {
                res.status(201).send(result)
            } else {
                let msg = { "error_msg": "Internal server error" }
                res.status(500).send(msg);
            }
        })
    }


})

//Endpoint 4(done) change
app.put('/updateActor',verifyToken, function (req, res) {
    var actor_id = req.body.actor_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    if (first_name == "" && last_name == "") {
        let msg = { "error_msg": "missing data" }
        res.status(400).send(msg)
    } else {
        actor.updateName(first_name, last_name, actor_id, function (err, result) {
            if (!err) {
                var succ = { "success_msg": "record updated" }
                res.status(200).send(succ);
            } else {
                let msg = { "error_msg": "Internal server error" }
                res.status(500).send(msg);
            }

        })
    }
})


//Endpoint 5
app.delete('/deleteActor', verifyToken, function (req, res) {
    const actor_id = req.body.actor_id;

    actor.deleteActor(actor_id, actor_id, function (err, result) {

        if (!err) {
            let succ = { "success_msg": "actor deleted" }
            res.status(201).send(succ);
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(500).send(msg)
        }

    })


})

//Endpoint 6

app.get('/searchbycategory', function (req, res) {
    const catergory_id = req.query.category;
    const price = req.query.price || 5
    actor.getFilmbyCategory(catergory_id, price, function (err, result) {
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
app.post('/customers', verifyToken, function (req, res) {

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var store_id = req.body.store_id;
    var email = req.body.email;
    var address = req.body.address;


    if (first_name == "" || last_name == "" || email == "" || store_id == "" || address.address_line1 == "" || address.district == "" || address.city_id == "" || address.postal_code == "" || address.phone == "") {
        let msg = { "Message": "missing data" };
        res.status(400).send(msg);
    } else {
        actor.addCustomerAddress(address, function (err, result) {
            if (!err) {
                let selectID = result;
                actor.addCustomer(store_id, first_name, last_name, email, selectID, function (err, result) {
                    if (!err) {

                        let msg = { "Message": "Customer Added!" };
                        res.status(201).send(msg);
                    } else {
                        if (err.code == "ER_DUP_ENTRY") {
                            //checking for duplicate entry
                            actor.deleteAddress(selectID, function (err, result) {
                                if (!err) {
                                    let msg = { "Message": "Email exists" }
                                    res.status(201).send(msg);
                                } else {
                                    let msg = { "error_msg": "missing data" };
                                    res.status(400).send(msg);
                                }
                            })
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
    }
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



