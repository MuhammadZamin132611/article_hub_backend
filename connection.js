const mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.BD_NAME,
});

// select user,authentication_string,plugin,host from mysql.user;

connection.connect((error) => {
  if (!error) {
    console.log("connected database port 8080");
  } else {
    console.log(error);
  }
});

module.exports = connection;
