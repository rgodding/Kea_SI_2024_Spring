-- GranularDB setup
-- Uses PostgreSQL syntax

-- Create the granular database
CREATE DATABASE testdb;

-- Create schemas
CREATE SCHEMA gs;

-- Create the tables
CREATE TABLE gs.items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT FALSE
);

-- CREATE ROLE
CREATE ROLE customer WITH PASSWORD 'customer';
ALTER ROLE customer LOGIN;

-- Create Employee
CREATE ROLE employee WITH PASSWORD 'employee';
ALTER ROLE employee LOGIN;

-- Manager
CREATE ROLE manager WITH PASSWORD 'manager';
ALTER ROLE manager LOGIN;


-- Grant Access
-- Customer
GRANT USAGE ON SCHEMA gs TO customer;
GRANT SELECT ON gs.items TO customer;

-- Employee
GRANT ALL ON SCHEMA gs TO employee;
GRANT SELECT ON gs.items TO employee;
GRANT UPDATE (name, price, description, visible) ON gs.items TO employee;

-- Manager
GRANT ALL ON SCHEMA gs TO manager;
GRANT SELECT, INSERT, UPDATE, DELETE ON gs.items TO manager;

-- Row-Level Security
ALTER TABLE gs.items ENABLE ROW LEVEL SECURITY;

--  Policies
CREATE POLICY items_policy_customer ON gs.items
FOR SELECT
TO customer
USING (visible = true);

-- Employee
CREATE POLICY items_policy_employee ON gs.items
FOR ALL
TO employee
USING (true);

-- Manager (Full access)
CREATE POLICY items_policy_manager ON gs.items
FOR ALL
TO manager
USING (true);

-- Drop  All
-- POLICIES
DROP POLICY items_policy_customer ON gs.items;
DROP POLICY items_policy_employee ON gs.items;
DROP POLICY items_policy_manager ON gs.items;
-- ROW LEVEL SECURITY
ALTER TABLE gs.items DISABLE ROW LEVEL SECURITY;

-- ROLES
REVOKE ALL ON SCHEMA gs FROM customer;
REVOKE ALL ON DATABASE testdb FROM customer;
REVOKE ALL ON SCHEMA gs FROM employee;
REVOKE ALL ON DATABASE testdb FROM employee;
REVOKE ALL ON SCHEMA gs FROM manager;
REVOKE ALL ON DATABASE testdb FROM manager;
DROP ROLE customer;
DROP ROLE employee;
DROP ROLE manager;

-- TABLES
DROP TABLE gs.items;

-- SCHEMAS
DROP SCHEMA gs;