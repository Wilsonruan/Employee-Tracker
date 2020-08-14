CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
  dept_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30)
);

CREATE TABLE roles(
  role_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30),
  role_salary DECIMAL(10,2),
  role_id INTEGER,
);

CREATE TABLE employee(
	employee_id INT AUTO_INCREMENT PRIMARY KEY,
	employee_first_name VARCHAR(30), 
	employee_last_name VARCHAR(30), 
	employee_role_id INT, 
	employee_manager_id INT, 
);