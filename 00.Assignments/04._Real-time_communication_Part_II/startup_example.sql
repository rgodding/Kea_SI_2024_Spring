-- DROP EXISITING DATA
DROP DATABASE IF EXISTS app_db;
DROP DATABASE IF EXISTS sales_db;
DROP USER IF EXISTS 
'dev'@'localhost',
-- App users
'read_app_user'@'localhost', 
'rw_app_user'@'localhost',
'read_app_products_user'@'localhost',
'rw_app_products_user'@'localhost',
-- Sale users
'read_sales_user'@'localhost', 
'rw_sales_user'@'localhost';
DROP ROLE IF EXISTS
'developer',
-- App Roles
'app_read',
'app_write',
'app_products_read',
'app_products_write',
-- Sales Roles
'sales_read',
'sales_write';

-- Create Users
CREATE USER IF NOT EXISTS 
-- Developer
'dev'@'localhost' IDENTIFIED BY 'devpass',
-- App users
'read_app_user'@'localhost' IDENTIFIED BY 'pass', 
'rw_app_user'@'localhost' IDENTIFIED BY 'pass',
'read_app_products_user'@'localhost' IDENTIFIED BY 'pass',
'rw_app_products_user'@'localhost' IDENTIFIED BY 'pass',
-- Sales users
'read_sales_user'@'localhost' IDENTIFIED BY 'pass', 
'rw_sales_user'@'localhost' IDENTIFIED BY 'pass';

-- Create Roles
CREATE ROLE IF NOT EXISTS 
-- Developer
'developer',
-- App Roles
'app_read',
'app_write',
'app_products_read',
'app_products_write',
-- Sales Roles
'sales_read',
'sales_write';

-- Create Database and Tables
-- APP DB
CREATE DATABASE IF NOT EXISTS app_db;
use app_db;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(16) UNIQUE,
    name VARCHAR(24)
);
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(55) UNIQUE,
    price DECIMAL,
    description TEXT
);

-- SALES DB
CREATE DATABASE IF NOT EXISTS sales_db;
use sales_db;
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(16) UNIQUE,
    amount decimal,
    date DATETIME
);

-- Create Startup privileges
GRANT ALL ON sale_db.* TO 'developer';
GRANT ALL ON app_db.* TO 'developer';

-- App Permissions
GRANT SELECT ON app_db.* TO 'app_read';
GRANT INSERT, UPDATE, DELETE ON app_db.* TO 'app_write';
GRANT SELECT ON app_db.products TO 'app_products_read';
GRANT INSERT, UPDATE, DELETE ON app_db.products TO 'app_products_write';

-- Sales Permissions
GRANT SELECT ON sales_db.* TO 'sales_read';
GRANT INSERT, UPDATE, DELETE ON sales_db.* TO 'sales_write';

-- Assign roles to users
GRANT 'developer' TO 'dev'@'localhost';
-- App
GRANT 'app_read' TO 'read_app_user'@'localhost';
GRANT 'app_read', 'app_write' TO 'rw_app_user'@'localhost';
GRANT 'app_products_read' TO 'read_app_products_user'@'localhost';
GRANT 'app_products_read', 'app_products_write' TO 'rw_app_products_user'@'localhost';
-- Sales
GRANT 'sales_read' TO 'read_sales_user'@'localhost';
GRANT 'sales_read', 'sales_write' TO 'rw_sales_user'@'localhost';


SET DEFAULT ROLE 'app_read' TO 'dev'@'localhost';
-- Setup default roles
SET DEFAULT ROLE ALL TO
'dev'@'localhost',
-- App users
'read_app_user'@'localhost', 
'rw_app_user'@'localhost',
'read_app_products_user'@'localhost',
'rw_app_products_user'@'localhost',
-- Sale users
'read_sales_user'@'localhost', 
'rw_sales_user'@'localhost';