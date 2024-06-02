const express = require("express");
const router = express.Router();
const userController = require('../controllers/users')
const postController = require("../controllers/postController");

router.get("/", (req, res) => {
    res.render('HomePage')
});
router.get("/HomePage", (req, res) => {
    res.render('HomePage')
});
router.get("/login", (req, res) => {
    res.render('login')
});
router.get("/register", (req, res) => {
    res.render('register')
});

// Proprietaire
// router.get("/client_post", userController.isLoggedIn, postController.view, (req, res) => {
//     if (req.user && req.user.role == "proprietaire") {
//         res.render('client_post', { user: req.user })
//     }else {
//         res.redirect("/login")
//     }
// });
router.get("/client_post", userController.isLoggedIn, (req, res, next) => {
    if (req.user && req.user.role === "proprietaire") {
        // If the user is logged in and has the role of "proprietaire"
        // Proceed to the next middleware
        return next();
    } else {
        // If not, redirect to the login page
        res.redirect("/login");
    }
}, postController.view);



// Decouvrir gardien
router.get("/gardien_decouvrir", userController.isLoggedIn, (req, res, next) => {
    if (req.user && req.user.role === "gardien") {
        // If the user is logged in and has the role of "proprietaire"
        // Proceed to the next middleware
        return next();
    } else {
        // If not, redirect to the login page
        res.redirect("/login");
    }
}, postController.view_gardien);
// Decouvrir gardien



// router.get("/client_decouvrir", userController.isLoggedIn,(req, res) => {
//     if (req.user && req.user.role == "proprietaire") {
//         res.render('client_decouvrir', { user: req.user })
//     }else {
//         res.redirect("/login")
//     }
// }, userController.view_profile_gardien);
router.get("/client_decouvrir", userController.isLoggedIn, userController.view_profile_gardien);



router.get("/client_profile", userController.isLoggedIn,(req, res) => {
    if (req.user && req.user.role == "proprietaire") {
        res.render('client_profile', { user: req.user })
    }else {
        res.redirect("/login")
    }
});

// Gardien
router.get("/gardien_decouvrir", userController.isLoggedIn,(req, res) => {
    if (req.user && req.user.role == "gardien") {
        res.render('gardien_decouvrir', { user: req.user })
    }else {
        res.redirect("/login")
    }
});
router.get("/gardien_profile", userController.isLoggedIn,(req, res) => {
    if (req.user && req.user.role == "gardien") {
        res.render('gardien_profile', { user: req.user })
    }else {
        res.redirect("/login")
    }
});

// Edit Profile
router.get("/edit_profile_client/:id", userController.isLoggedIn, (req, res, next) => {
    if (req.user && req.user.role === "proprietaire") {
        // If the user is logged in and has the role of "proprietaire"
        // Proceed to the next middleware
        return next();
    } else {
        // If not, redirect to the login page
        res.redirect("/login");
    }
}, userController.edit);
router.get("/edit_profile_gardien/:id", userController.isLoggedIn, (req, res, next) => {
    if (req.user && req.user.role === "gardien") {
        // If the user is logged in and has the role of "proprietaire"
        // Proceed to the next middleware
        return next();
    } else {
        // If not, redirect to the login page
        res.redirect("/login");
    }
}, userController.edit);
// router.get('/edit_profile_client/:id', userController.edit);
// router.get('/edit_profile_gardien/:id', userController.edit);

//Update Profile
router.post('/edit_profile_client/:id', userController.update)
router.post('/edit_profile_gardien/:id', userController.update)



//Post routes
// Serve the favicon.ico file from the 'public' directory
const path = require('path');
router.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));


// const postController = require("../controllers/postController");


// create, find, update, delete 
// router.get('/client_post', postController.view);
router.post('/client_post', postController.find);
router.post('/gardien_decouvrir', postController.find_gardien);
router.get('/addpost', postController.form);
router.post('/addpost', postController.create);
router.get('/editpost/:id', postController.edit);
router.post('/editpost/:id', postController.update);
router.get('/viewpost/:id', postController.viewpost);
router.get('/client_post:id', postController.delete);
//Post routes

// Find Profile Gardien
router.post('/client_decouvrir', postController.find_gardien);
// Find Profile Gardien


module.exports = router;