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

// Function to build cli table
let buildTable = function (res) {
    var table = new Table({
        head: ['Product ID', 'Product Name', 'Department', 'Price', 'Stock'],
    })

    for (i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
    }
    console.log(table.toString());
}

// Function that runs customer through series of prompts and adjusts visual table and MySql table accordingly
let customerStart = function () {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) {
            console.log(err);
        }
        buildTable(res);
        // Item selection prompt
        inquirer.prompt([{
            type: 'input',
            message: 'Please enter the id of the item you would like to buy.',
            name: 'id',
        }]).then(function secondQuery(result) {
            var idParam = result;
            var id = idParam.id;
            connection.query(`SELECT stock_quantity, price FROM products WHERE item_id = ?`, [id], function (err, res) {
                var stock = res[0].stock_quantity;
                var price = res[0].price;
                console.log(price);
            // Checks if selected item is in stock, if not, returns customer to item selection prompt
                if (stock <= 0) {
                    console.log("This item is out of stock, please select another item.")
                    setTimeout(function(){customerStart()}, 3000);
                }
                // Quantity selection prompt
                else {
                    inquirer.prompt([{
                        type: 'input',
                        message: 'How many would you like to buy?',
                        name: 'quantity'
                    }]).then(result => {
                        var quantity = result.quantity;
                        var newQuantity = stock - quantity;
                        var totalPrice = price * quantity;
                        // Checks if suffiecient quantity of selected item is available, returns to allow customer to select new quantity if insufficient
                        if (newQuantity < 0){
                            console.log(`Insufficient stock available, you can order a maximum of ${stock}`)
                            setTimeout(function(){secondQuery(idParam)}, 3000)
                        }
                        // Returns amount of item purchased and total purchase cost, then returns customer to beginning of prompts
                        else{
                            connection.query(`UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?`, [quantity, id])
                            console.log(`You bought ${quantity} for a total of $${totalPrice}.`)
    
                            setTimeout(function(){customerStart()}, 3000);
                        }
                    })
                }
            });
        })
    })
}

customerStart();






