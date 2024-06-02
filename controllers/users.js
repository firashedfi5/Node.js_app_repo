const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Signin
exports.register = (req, res) => {
    console.log(req.body);
    const { username, role, telephone, email, password, passwordConfirm } = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }
        if (result.length > 0) {
            return res.render('register', {msg: 'Email is already in use', msg_type: "error"});
        } else if (password !== passwordConfirm) {
            return res.render('register', {msg: 'Password does not match', msg_type: "error"});
        }

        //Check if the username used or not
        const usernameExists = await new Promise((resolve, reject) => {
            db.query('SELECT username FROM users WHERE username = ?', [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length > 0);
                }
            });
        });
        if (usernameExists) {
            return res.render('register', {msg: 'Username is already in use', msg_type: "error"});
        }
        //Check if the username used or not

        let hashedPassword = await bcrypt.hash(password, 8);
        // console.log(hashedPassword)

        db.query('INSERT INTO users SET ?', {username:username, role:role, telephone:telephone,email:email,password:hashedPassword}, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                console.log(result);
                return res.render("register", {msg: "User Registred Successfully", msg_type: "success"})
            }
        });

    });
};

// exports.login = async (req, res) => {
//     try {
//         const { email, password} = req.body;
//         if (!email || !password) {
//             return res.status(400).render('login', {msg: 'Please Enter Your Email and Password', msg_type: "error"});
//         }

//         db.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
//             console.log(result);
//             if (result.length <= 0) {
//                 return res.status(401).render('login', {msg: 'Email or Password incorect', msg_type: "error"});
//             } else {
//                 if (!(await bcrypt.compare(password, result[0].password))) {
//                     return res.status(401).render('login', {msg: 'Email or Password incorect', msg_type: "error"});
//                 } else {
//                     // res.send("Good");
//                     const id = result[0].id;
//                     const token = jwt.sign({ id:id }, process.env.JWT_SECRET, {
//                         expiresIn: process.env.JWT_EXPIRES_IN
//                     });
//                     console.log("The Token is " + token);
//                     const cookieOptions = {
//                         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
//                         httpOnly: true,
//                     };
//                     res.cookie("firas",token,cookieOptions);
//                     res.status(200).redirect("/post_client")
//                 }
//             }
//         });

//     } catch (error) {
//         console.log(error);
//     };
// };

//Login
exports.login = async (req, res) => {
    try {
        const { email, password} = req.body;
        if (!email || !password) {
            return res.status(400).render('login', {msg: 'Please Enter Your Email and Password', msg_type: "error"});
        }
        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
            console.log(result);
            if (result.length <= 0) {
                return res.status(401).render('login', {msg: 'Email or Password incorect', msg_type: "error"});
            } else {
                if (!(await bcrypt.compare(password, result[0].password))) {
                    return res.status(401).render('login', {msg: 'Email or Password incorect', msg_type: "error"});
                } else {
                    // res.send("Good");
                    const id = result[0].id;
                    const token = jwt.sign({ id:id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    console.log("The Token is " + token);
                    const cookieOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
                        httpOnly: true,
                    };
                    res.cookie("firas",token,cookieOptions);
                    // res.status(200).redirect("/post_client")
                    if (result[0].role == "proprietaire") {
                        res.status(200).redirect("/client_post")
                    } else {
                        res.status(200).redirect("/gardien_decouvrir")
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
    };
};

exports.isLoggedIn = async (req, res, next) => {
    // req.name = "Check Login...";
    //console.log(req.cookies);
    if (req.cookies.firas) {
        try {
            const decode = await promisify(jwt.verify)(
                req.cookies.firas,
                process.env.JWT_SECRET
            );
            console.log(decode);
            db.query('SELECT * FROM users WHERE id = ?', [decode.id], (err, result) => {
                // console.log(result);
                if (!result) {
                    return next();
                }
                req.user = result[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        };
    } else {
        next();
    }
};

exports.logout = async (req, res) => {
    res.cookie("firas","logout",{
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });
    res.status(200).redirect("/HomePage");
};



// Edit Profile
// exports.edit = (req, res) => {

//     const postId = req.params.id;
//     console.log("Profile ID to update:", postId);

//     db.getConnection((err, connection) => {
//         if(err) throw err; // not connected
//         console.log("Connected successfully to MySql... ");
//         //Post the connection
//         connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
//             // When done with the connection, release it
//             connection.release();
//             if (!err) {
//                 res.render('edit_profile_client', { rows });
//                 console.log(rows);
//             }
//             else {
//                 console.log(err);
//             }
//             // console.log("The data from post table : \n", rows)
//         });
//     });
// }

exports.edit = (req, res) => {
    const postId = req.params.id;
    console.log("Profile ID to update:", postId);

    db.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log("Connected successfully to MySql...");

        connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release();
            if (!err) {
                if (rows.length > 0) {
                    const role = rows[0].role; // Assuming 'role' is the field in the database containing the role of the user
                    if (role === 'proprietaire') {
                        res.render('edit_profile_client', { rows });
                    } else if (role === 'gardien') {
                        res.render('edit_profile_gardien', { rows });
                    } else {
                        // Handle other roles or cases
                        res.send('Unknown role');
                    }
                    console.log("This user role is " + role);
                } else {
                    // Handle case where no user found with the given ID
                    res.send('User not found');
                }
            } else {
                console.log(err);
                // Handle database error
                res.send('Error fetching user data');
            }
        });
    });
}




// Profile update
// exports.update = (req, res) => {

//     const postId = req.params.id;
//     console.log("Post ID to update:", postId);

//     // const { animaux, nom_de_animal, prestation, ville, date, numero_de_telephone,race, sexe, age } = req.body;
//     const { username, telephone, email } = req.body;

//     db.getConnection((err, connection) => {
//         if(err) throw err; // not connected
//         console.log("Connected successfully to MySql... ");
//         //Post the connection
//         connection.query('UPDATE users SET username = ?, telephone = ?, email = ? WHERE id = ?',[username, telephone,email,req.params.id], (err, rows) => {
//             // When done with the connection, release it
//             connection.release();
//             if (!err) {
//                 db.getConnection((err, connection) => {
//                     if(err) throw err; // not connected
//                     console.log("Connected successfully to MySql... ");
//                     //Post the connection
//                     connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
//                         // When done with the connection, release it
//                         connection.release();
//                         if (!err) {
//                             // res.render('edit_post', { rows });//, alert: `This post has been updated` });
//                             let updatedPost = encodeURIComponent('Profile successefully updated');
//                             res.redirect('/client_profile?updated=' + updatedPost);
//                         }
//                         else {
//                             console.log(err);
//                         }
//                         // console.log("The data from post table : \n", rows)
//                     });
//                 });
//             }
//             else {
//                 console.log(err);
//             }
//             // console.log("The data from post table : \n", rows)
//         });
//     });
// }

exports.update = (req, res) => {
    const postId = req.params.id;
    console.log("Post ID to update:", postId);

    const { username, telephone, email } = req.body;

    db.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log("Connected successfully to MySql...");

        connection.query('UPDATE users SET username = ?, telephone = ?, email = ? WHERE id = ?', [username, telephone, email, req.params.id], (err, rows) => {
            connection.release();
            if (!err) {
                db.getConnection((err, connection) => {
                    if (err) throw err; // not connected
                    console.log("Connected successfully to MySql...");

                    connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
                        connection.release();
                        if (!err) {
                            let updatedPost = encodeURIComponent('Profile successfully updated');
                            
                            // Assuming role is a property in rows
                            if (rows.length > 0 && rows[0].role === 'proprietaire') {
                                res.redirect('/client_profile?updated=' + updatedPost);
                            } else if (rows.length > 0 && rows[0].role === 'gardien') {
                                res.redirect('/gardien_profile?updated=' + updatedPost);
                            }
                        } else {
                            console.log(err);
                        }
                    });
                });
            } else {
                console.log(err);
            }
        });
    });
}


// Decouvrir profile gardien
// exports.view_profile_gardien = (req, res) => {
//     pool.getConnection((err, connection) => {
//         if(err) throw err; // not connected
//         console.log("Connected successfully to MySql... ");
//         //Post the connection
//         connection.query('SELECT * FROM users WHERE role = "gardien"', (err, rows) => {
//             // When done with the connection, release it
//             connection.release();
//             if (!err) {
//                 res.render('client_decouvrir', { rows });
//             } else {
//                 console.log(err);
//             }
//             console.log("The data from post table : \n", rows);
//         });
//     });
// };
exports.view_profile_gardien = (req, res) => {
    if (req.user && req.user.role === "proprietaire") {
        db.getConnection((err, connection) => {
            if(err) throw err; // not connected
            console.log("Connected successfully to MySql... ");
            // Post the connection
            connection.query('SELECT * FROM users WHERE role = "gardien"', (err, rows) => {
                // When done with the connection, release it
                connection.release();
                if (!err) {
                    res.render('client_decouvrir', { rows });
                } else {
                    console.log(err);
                }
                console.log("The data from users table: \n", rows);
            });
        });
    } else {
        res.redirect("/login");
    }
};


// Decouvrir profile gardien


// Find profile gardien 
// exports.find_profile_gardien = (req, res) => {

//     db.getConnection((err, connection) => {
//         if(err) throw err; // not connected
//         console.log("Connected successfully to MySql... ");
        
//         let searchTerm = req.body.search;
        
//         //Post the connection
//         connection.query('SELECT * FROM users WHERE role = "gardien AND username LIKE ? OR email LIKE ? OR telephone LIKE ? "', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'] , (err, rows) => {
//             // When done with the connection, release it
//             connection.release();
//             if (!err) {
//                 res.render('client_decouvrir', { rows });
//             }
//             else {
//                 console.log(err);
//             }

//             // console.log("The data from post table : \n", rows)

//         });
//     });

// };
// Find profile gardien 
