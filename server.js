var mysql = require("mysql");
var { prompt } = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  port: process.env.PORT || 3306,
  user: "wilsonruan23@gmail.com",
  password: "Qwaszx92!"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});