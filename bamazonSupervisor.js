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

// Funtion to dispaly sales by department.
let displaySalesByDept = function () {
    var table = new Table({
        head: ['Department ID', 'Department Name', 'Overhead Cost', 'Product Sales', 'Profit'],
    });
    connection.query(`SELECT * FROM departments`, function (err, res) {
        if (err) {
            console.log(err)
        }
        else {
            let response = res;
            var count = 0;
            for (i = 1; i < response.length + 1; i++) {

                connection.query(`SELECT SUM(product_sales - overhead_costs) AS profit FROM departments WHERE department_id = ?`, i, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // console.log(res)
                        response[count].profit = res[0].profit;
                        table.push([response[count].department_id, response[count].department_name, response[count].overhead_costs, response[count].product_sales, response[count].profit])
                        count++
                    }

                    if (count === response.length) {
                        console.log(table.toString());
                    }
                })
            };
            setTimeout(function () { start() }, 2000)
        }
    })
}

// Function to add new department
let addNewDept = function () {
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the name of the new department?'
    }]).then(result => {
        let deptName = result.name;

        inquirer.prompt([{
            type: 'input',
            name: 'overhead',
            message: 'What is the overhead cost of this department?',
            default: 0
        }]).then(result => {
            let deptOverhead = Number(result.overhead);

            inquirer.prompt([{
                type: 'input',
                name: 'sales',
                message: 'What is the current sales value of this department?',
                default: 0
            }]).then(result => {
                let sales = Number(result.sales);

                connection.query(`INSERT INTO departments(department_name, overhead_costs, product_sales)
                 VALUES( ?, ?, ?)`, [deptName, deptOverhead, sales],
                    function (err, res) {
                        if (err) {
                            console.log(err);
                            start();
                        }
                        displaySalesByDept();
                    }
                )
            })
        })
    })
}

// Inquirer choices
const options = ['View sales by department.', 'Add new department', 'Quit'];

// Inquirer command prompt.
let start = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'command',
        message: 'What would you like to do?',
        choices: options
    }]).then(result => {
        let command = result.command;

        switch (command) {
            case options[0]:
                console.log("Displaying sales....");
                displaySalesByDept();
                break;
            case options[1]:
                addNewDept();
                break;
            case options[2]:
                console.log("Goodbye.");
                connection.end();
        }
    })
}

start();
