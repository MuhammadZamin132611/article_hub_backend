const express = require("express");
const connection = require("../connection");

const router = express.Router();
const auth = require("../services/authentication");

router.post("/addNewCategory", auth.authenticateToken, (req, res) => {
  let category = req.body; 
  query = "insert into articleHub.category (name) values(?);";
  connection.query(query, [category.name], (err, results) => {
    if (!err) {
      return res
        .status(200)
        .json({ results: results, message: "Category Added Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/getAllCategory", auth.authenticateToken, (req, res) => {
  var query = "select * from articleHub.category order by name;";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/updateCategory", auth.authenticateToken, (req, res) => {
  let category = req.body;
  var query = "update articleHub.category set name=? where id=?;";
  connection.query(query, [category.name, category.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(401).json({ message: "Category ID not found" });
      }
      return res.status(200).json({ message: "Category Updated Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.delete("/deleteCategory/:id", auth.authenticateToken, (req, res) => {
  let categoryId = req.params.id; // Assuming the ID of the category to delete is sent in the request body

  var query = "DELETE FROM articleHub.category WHERE id = ?;";
  connection.query(query, [categoryId], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(401).json({ message: "Category ID not found" });
      }
      return res.status(200).json({ message: "Category Deleted Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;
