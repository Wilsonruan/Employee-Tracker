-- Drops the employee_db if it exists currently --
drop database employee_db;
-- Creates the "employee_db" database --
CREATE DATABASE employee_db;
-- Makes it so all of the following code will affect employee_db --
USE employee_db;

-- Creates the table "deparment" within employee_db --
CREATE TABLE department(
  dept_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30)
);

SELECT * from department;

-- Creates the table "role" within employee_db --
CREATE TABLE role(
  role_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(10,2),
  dept_id INTEGER,
  FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);

SELECT * from role;

-- Creates the table "employee" within employee_db --
CREATE TABLE employee(
	emp_id INT AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(30),
	last_name VARCHAR(30), 
	role_id INT, 
	manager_id INT, 
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (manager_id) REFERENCES employee(emp_id)
  );

  SELECT * from employee;