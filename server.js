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
      name: "department",
      message: "What would you like to do?",
      choices: [
          "Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Role",
          "Update Employee Manager", "View Employees by Manager", "Delete Department", "Delete Role", "Delete Employee", "View the Total Budget of a Department"
      ]
  },
  {
      type: "input",
      name: "department_name",
      message: "Input Department Name:",
      when: function (answers) {
          return answers.what_to_do == "Add Department"
      }
  },
  ).then((response) => {
    if (response.department == "Add Department") {
      add_department(response.department_name);
  } else if (response.department == "View Departments") {
      view_departments();
  } else if (response.department == "Add Role") {
      add_role(response);
  } else if (response.department == "View Roles") {
      view_roles();
  } else if (response.department == "Add Employee") {
      add_employee(response);
  } else if (response.department == "View Employees") {
      view_employees();
  } else if (response.department == "Update Employee Role") {
      update_employee_roles(response);
  } 
  }).catch((err) => {
    console.error(err)
    return connection.end()
})
}

function add_department (response) {
  var string = 
  `
      INSERT INTO department (dept_name)
      VALUES ("${response}")
  `;
  con.query(string, function (err, res) {
    if (err) throw err; 
    start_function()
  })
}