var mysql = require("mysql");
var { prompt } = require("inquirer");

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
});