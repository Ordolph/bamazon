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

let buildTables = function (err, res) {
    var table = new Table({
        head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock'],
    })
    if (err) {
        throw err;
    }
    else {
        for (i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
        }
        console.log(table.toString());
        setTimeout(function () { start() }, 3000);
    }
}
let viewProducts = function () {
    connection.query(`SELECT * FROM products`, function (err, res) {
        buildTables(err, res);
    })
}

let viewLowInventory = function () {
    connection.query(`SELECT * FROM products WHERE stock_quantity < 6`, function (err, res) {
        buildTables(err, res);
    }
    )
}

let addInventory = function () {
    inquirer.prompt([{
        type: 'input',
        message: 'Please enter the ID of the item you would like to add inventory to.',
        name: 'id'
    }]).then(response => {
        var id = response.id;
        console.log(id)
        connection.query(`SELECT stock_quantity, product_name FROM products WHERE item_id = ?`, id, function (err, res) {
            if (err) {
                console.log(err)
            }
            let stock = Number(res[0].stock_quantity);
            let name = res[0].product_name;

            inquirer.prompt([{
                type: 'input',
                message: `There are currently ${stock} of ${name}, how many would you like to add?`,
                name: 'quantity',
            }]).then(response => {
                var quantity = Number(response.quantity);
                var newQuantity = quantity + stock;

                connection.query(`UPDATE products SET stock_quantity = ? WHERE item_id = ?`, [newQuantity, id]);
                viewProducts();
            })
        })
    })
}

let addNewProduct = function () {
    inquirer.prompt([{
        type: 'input',
        message: 'What is the name of the product you would like to add?',
        name: 'name'
    }]).then(response => {
        var name = response.name;

        inquirer.prompt([{
            type: 'input',
            message: 'What department would you like your item to be in?',
            name: 'department'
        }]).then(response => {
            var department = response.department;

            inquirer.prompt([{
                type: 'input',
                message: 'What is the price of your item?',
                name: 'price'
            }]).then(response => {
                var price = Number(response.price);

                inquirer.prompt([{
                    type: 'input',
                    message: 'How many would you like to add?',
                    name: 'quantity',
                }]).then(response => {
                    var quantity = Number(response.quantity);

                    connection.query(
                        `INSERT INTO products(product_name, department_name, price, stock_quantity)
                        VALUES(?,?,?,?)`, [name, department, price, quantity], function (err, res) {
                            if (err) {
                                console.log(err)
                            }
                            viewProducts();
                        })
                })
            })
        })
    })
}

const options = ['View products', 'View low inventory', 'Add inventory', 'Add New Product', 'Quit'];

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
            case options[4]:
                console.log("Goodbye.")
                connection.end();
        }
    })
}

start();