//M.Rajkaran
//2109039
//DIT/FT/1B/02
var db = require('./databaseConfig.js')

var userDB = {
    verify: function (username, password, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {//database connection gt issue!

                console.log(err);
                return callback(err, null);
            } else {

                const query = "SELECT * FROM staff WHERE email = ? and password = ?";

                dbConn.query(query, [username, password], (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    if (results.length === 0) {
                        return callback(null, null);

                    } else {
                        const user = results[0];
                        return callback(null, user);
                    }
                });
            }
        });
    },

    getMovieById: function (film_id, callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = "SELECT film.film_id, film.title,film.description, category.name AS category, film.rating, film.release_year FROM film JOIN film_category ON film_category.film_id=film.film_id JOIN category ON category.category_id=film_category.category_id WHERE film.film_id = ?;"
                conn.query(sql, [film_id], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    searchByTitle: function (title, price, callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = "SELECT film.film_id, film.title,film.description, category.name AS category, film.rating, film.release_year FROM film JOIN film_category ON film_category.film_id=film.film_id JOIN category ON category.category_id=film_category.category_id WHERE film.title LIKE UPPER(?) AND film.rental_rate <=?;"
                conn.query(sql, [("%" + title + "%"), price], function (err, result) {
                    conn.end()
                    if (err) {

                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },


    searchActors: function (film_id, callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {

                var sql = "SELECT film_actor.actor_id ,actor.first_name, actor.last_name FROM film JOIN film_actor ON film.film_id=film_actor.film_id JOIN actor ON film_actor.actor_id=actor.actor_id WHERE film.film_id = ?"

                conn.query(sql, [film_id], function (err, result) {
                    conn.end()
                    if (err) {

                        console.log(err)
                        return callback(err, null)
                    } else {

                        return callback(null, result)
                    }
                })
            }
        })




    },


    // populate search bar
    getCategories: function (callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = 'SELECT name, category_id FROM category'
                conn.query(sql, function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {

                        return callback(null, result)
                    }
                })
            }
        })
    },

    getCities: function (callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = 'SELECT city_id, city FROM city'
                conn.query(sql, function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {

                        return callback(null, result)
                    }
                })
            }
        })
    },

    getStores: function (callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = 'SELECT store.store_id, address.address FROM store JOIN address ON store.address_id=address.address_id;'
                conn.query(sql, function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {

                        return callback(null, result)
                    }
                })
            }
        })
    },

    getActorSelect: function (callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = 'SELECT actor_id, first_name, last_name FROM actor;'
                conn.query(sql, function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {

                        return callback(null, result)
                    }
                })
            }
        })
    },

    //Endpoint1
    getActor: function (actor_id, callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("POSTMAN retrieving actor " + actor_id)
                var sql = 'SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?'
                conn.query(sql, [actor_id], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        // return details of selected actor
                        return callback(null, result[0])
                    }
                })
            }
        })
    },
    //Endpoint 2
    getActors: function (limit, offset, callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("POSTMAN add new actor")
                var sql = 'SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name ASC LIMIT ? OFFSET ?'
                conn.query(sql, [limit, offset], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    //Endpoint3
    newActor: function (first_name, last_name, callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("POSTMAN add new actor")
                var sql = 'INSERT INTO actor(first_name, last_name) VALUES(?,?)'
                conn.query(sql, [first_name, last_name], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    //Endpoint 4

    updateName: function (first_name, last_name, actor_id, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                // Only update the last_name column if a value is provided
                if (last_name != undefined && first_name != undefined) {
                    var sql = 'UPDATE actor SET first_name = ?, last_name = ? WHERE (actor_id = ?);';
                    conn.query(sql, [first_name, last_name, actor_id], function (err, result) {
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            
                            return callback(null, result);
                        }
                    });
                }
                else if (last_name == undefined && first_name != undefined) {
                    var sql = 'UPDATE actor SET first_name = ? WHERE (actor_id = ?);';
                    conn.query(sql, [first_name, actor_id], function (err, result) {
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    });
                }
                else {
                    var sql = 'UPDATE actor SET last_name = ? WHERE (actor_id = ?);';
                    conn.query(sql, [last_name, actor_id], function (err, result) {
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    });
                }
            }
        });

    },

    //Endpoint5

    deleteActor: function (actor_id, actor_id, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {

                var sql = 'DELETE FROM film_actor WHERE (actor_id=?);'
                sql += 'DELETE FROM actor WHERE (actor_id=?);'
                conn.query(sql, [actor_id, actor_id], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        
                        return callback(null, result)
                    }
                })
            }
        })


    },

    //Endpoint6
    getFilmbyCategory: function (catergory_id, price, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = "SELECT film.film_id, film.title,film.description, category.name AS category, film.rating, film.release_year FROM film JOIN film_category ON film_category.film_id=film.film_id JOIN category ON category.category_id=film_category.category_id WHERE category.category_id=? AND film.rental_rate <=?;"
                conn.query(sql, [catergory_id, price], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    //Endpoint 7
    getPaymentDetail: function (start_date, end_date, customer_id, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = 'SELECT film.title, payment.amount, DATE_FORMAT(payment.payment_date, "%Y-%m-%d %H:%i:%s") AS payment_date FROM inventory, film, rental, customer, payment WHERE inventory.film_id = film.film_id and rental.inventory_id = inventory.inventory_id and rental.customer_id = customer.customer_id and  payment.customer_id = customer.customer_id AND rental.rental_id = payment.rental_id AND (rental.rental_date BETWEEN ? AND ?) AND customer.customer_id = ?;';
                conn.query(sql, [start_date, end_date, customer_id], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },


    //Endpoint 8 add address

    addCustomerAddress: function (address, callback) {
        console.log(address)
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {

                var sql = 'INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES (?, ?, ?, ?, ?, ?)';
                conn.query(sql, [address.address_line1, address.address_line2, address.district, address.city_id, address.postal_code, address.phone], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result.insertId)
                    }
                })
            }
        })
    },


    //Endpoint 8
    addCustomer: function (store_id, first_name, last_name, email, selectID, callback) {
        var conn = db.getConnection()

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {

                var sql = 'INSERT INTO customer(store_id,first_name, last_name,email,address_id) VALUES(?,?,?,?,?);'
                conn.query(sql, [store_id, first_name, last_name, email, selectID], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })

    },

    deleteAddress: function (selectID, callback) {
        var conn = db.getConnection()

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = 'DELETE FROM address WHERE address_id =?;'
                conn.query(sql, [selectID], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },


    //Endpoint 9
    addCountry: function (country, callback) {
        var conn = db.getConnection()

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {

                var sql = 'INSERT INTO country(country) VALUES(?)'
                conn.query(sql, [country], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result.insertId)
                    }
                })
            }
        })
    },

    //Endpoint 9 city
    addCity: function (city, countryID, callback) {
        var conn = db.getConnection()

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var sql = 'INSERT INTO city(city, country_id) VALUES(?,?)'
                conn.query(sql, [city, countryID], function (err, result) {
                    conn.end()
                    if (err) {
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },





}

module.exports = userDB

