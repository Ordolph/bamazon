// Requirements for various node modules
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");
require('dotenv').config();

// MySql db connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'bamazon_db'
});

let viewProducts = function () {
    var table = new Table({
        head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock'],
    })
    connection.query(`SELECT * FROM products`, function(err, res) {
        if(err){
            throw err;
        }
        else{
            for (i = 0; i < res.length; i++) {
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
            }
            console.log(table.toString());
            setTimeout(function(){start()}, 3000);
        }
    })
}

const options = ['View products', 'View low inventory', 'Add inventory', 'Add New Product'];

function start() {
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'command',
        choices: options
    }]).then(command => {
        switch (command.command) {
            case options[0]:
                viewProducts();
                break;
            case options[1]:
                viewLowInventory();
                break;
            case options[2]:
                addInventory();
                break;
            case options[3]:
                addNewProduct();
                break;
        }
    })
}

start();