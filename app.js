const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

const app = express();

dotenv.config({
    path: './.env'
});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to MySQL...");
    }
});
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

pool.getConnection((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to MySQL...");
    }
});

app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

// console.log(__dirname);
const location = path.join(__dirname, "./public");
app.use(express.static(location));

app.set("view engine", "hbs");

const partialsPath = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialsPath)

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));




//Post
const bodyParser = require("body-parser");
app.use(bodyParser.json());
//Post




app.listen(5000, () => {
    console.log("Server Started at Port 5000")
})