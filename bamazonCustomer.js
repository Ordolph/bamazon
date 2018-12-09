const fs = require("fs");
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'bamazon_db'
});

let buildTable = function (res) {
    var table = new Table({
        head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock'],
        // colWidths: [100, 100, 100, 100, 100],
    })

    for (i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
    }
    // table.push(tableData);
    console.log(table.toString());
}



let customerStart = function () {

    connection.query('SELECT * FROM products', function (err, res) {
        if (err) {
            console.log(err);
        }
        buildTable(res);

        inquirer.prompt([{
            type: 'input',
            message: 'Please enter the id of the item you would like to buy.',
            name: 'id',
        }]).then(result => {
            var id = result.id;

            inquirer.prompt([{
                type: 'input',
                message: 'How many would you like to buy?',
                name: 'quantity'
            }]).then(result => {
                var quantity = result.quantity;

                connection.query(`UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?`, [quantity, id])
                console.log(`You bought ${quantity}`)

                customerStart();
            })
        })
    })
}

customerStart();






