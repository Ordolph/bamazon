CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Star Wars: Knights of the Old Republic", "Video Games", 10, 10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Star Wars: The Force Awakens", "Movies", 14, 10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Pulp Fiction", "Movies", 10, 10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Red Dead Revolver", "Video Games", 15, 10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Dog Collar", "Pet Supplies", 5, 10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Dog Leash", "Pet Supplies", 5, 10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Leather Shoes", "Clothing", 20, 10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Flannel Shirt", "Clothing", 15, 10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Tent", "Outdoors", 200, 10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
"Rucksack", "Outdoors", 100, 10
);

DROP TABLE departments;

CREATE TABLE departments(
	department_id INTEGER(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(40) NOT NULL,
    overhead_costs INTEGER(10) NOT NULL,
    product_sales INTEGER(10) NOT NULL
);


INSERT INTO departments(department_name, overhead_costs, product_sales)
VALUES('Clothing', 10000, 0
);

INSERT INTO departments(department_name, overhead_costs, product_sales)
VALUES('Video Games', 5000, 0
);


INSERT INTO departments(department_name, overhead_costs, product_sales)
VALUES('Movies', 15000, 0
);


INSERT INTO departments(department_name, overhead_costs, product_sales)
VALUES('Pet Supplies', 7500, 0
);


INSERT INTO departments(department_name, overhead_costs, product_sales)
VALUES('Outdoors', 3500, 0
);


