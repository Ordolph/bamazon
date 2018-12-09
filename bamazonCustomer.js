const fs = require("fs");
const mysql = require("mysql");
const inuirer = require("inquirer");

require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'bamazon_db'
});

connection.connect();

connection.query('SELECT * FROM products', function (err, res) {
    if (err) {
        console.log(err);
    }
    console.log(res);

    connection.destroy();
});




