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