# Granular DB Documentation
This PostgreSQL database is run on a virutal machine and features user privileges and granularity.

Below is presented all the necessarry documentation regarding the stage of the database


# Connect to the database
1. (Requirements)
   1. have postgresql installed along with the path(psql) setup
2. Open terminal and connect to the database    
    - psql -h 52.169.70.130 -p 5432 -d testdb -U user_name<br>

# Schema : gs
## TABLES
### gs.items
```sql
id SERIAL PRIMARY KEY
name VARCHAR(255) NOT NULL
price DECIMAL(10, 2) NOT NULL
description TEXT NOT NULL
stock INTEGER NOT NULL DEFAULT 0
visible BOOLEAN NOT NULL DEFAULT FALSE
```
In the table 'items', there has been implemented row-level security which takes the attribute 'visible' into account. If visible is false, customers are not able to see the products.

# USERS
## customer : customer
- SELECT ON gs.items
  - Can see where (visible = true)

## employee : employee
- SELECT ON gs.items
  - Can see all
- UPDATE ON gs.items
  - Can only update (name, price, description, visible)

## manager : manager
- SELECT, INSERT, UPDATE, DELETE on gs.items
  - Can access everything
- SELECT, INSERT, UPDATE, DELETE on gs.secrets
  - Can access everything