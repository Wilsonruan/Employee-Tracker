var mysql = require("mysql");
var inquirer = require("inquirer")

var con = mysql.createConnection({
  host: "localhost",
  port: process.env.PORT || 3306,
  user: "root",
  password: "Qwaszx92!",
  database: "employee_db"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  start_function ()
});

function start_function () {
  inquirer.prompt (
    {
      type: "list",
      name: "deparment",
      message: "Please select department function:",
      choices: [
          "Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Role"
      ]
  }
  ).then((response) => {
    if (response.deparment == "Add Department") {
      add_department(response.department_name);
  } else if (response.deparment == "View Departments") {
      view_departments();
  } else if (response.deparment == "Add Role") {
      add_role(response);
  } else if (response.deparment == "View Roles") {
      view_roles();
  } else if (response.deparment == "Add Employee") {
      add_employee(response);
  } else if (response.deparment == "View Employees") {
      view_employees();
  } else if (response.deparment == "Update Employee Role") {
      update_employee_roles(response);
  } 
  }).catch((err) => {
    console.error(err)
    return connection.end()
})
}