const express = require("express");
const connection = require("../connection");

const router = express.Router();
const auth = require("../services/authentication");

router.post("/addNewArticle", auth.authenticateToken, (req, res) => {
    let article = req.body;
    var query =
        "insert into articleHub.article(title,content,categoryId,publication_date,status) values(?,?,?,?,?);";
    connection.query(
        query,
        [
            article.title,
            article.content,
            article.categoryId,
            new Date(),
            article.status,
        ],
        (err, results) => {
            if (!err) {
                return res.status(200).json({ message: "Article Added Successfully" });
            } else {
                return res.status(500).json(err);
            }
        }
    );
});

router.get("/getAllArticle", auth.authenticateToken, (req, res) => {
    // var query = "select a.id, a.title, a.content, a.status, a.publication_date, c.id, as categoryId, c.name as categoryName from articleHub.article as a inner join articleHub.category as c where a.categoryId=c.id";
    var query =
        "SELECT a.id, a.title,a.content,a.status,a.publication_date,c.id AS categoryId,c.name AS categoryName FROM articleHub.article AS a INNER JOIN articleHub.category AS c WHERE a.categoryId = c.id;";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get("/getAllPublishedArticle", (req, res) => {
    var query =
        "SELECT a.id, a.title,a.content,a.status,a.publication_date,c.id AS categoryId,c.name AS categoryName FROM articleHub.article AS a INNER JOIN articleHub.category AS c WHERE a.categoryId = c.id AND a.status='published'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post("/updateArticle", auth.authenticateToken, (req, res) => {
    let article = req.body;
    var query =
        "update articleHub.article set title=?, content=?, categoryId=?, publication_date=?, status=? where id=?";
    connection.query(
        query,
        [
            article.title,
            article.content,
            article.categoryId,
            new Date(),
            article.status,
            article.id,
        ],
        (err, results) => {
            if (!err) {
                if (results.affectedRows == 0) {
                    return res.status(404).json({ message: "Article id does not found" });
                }
                return res
                    .status(200)
                    .json({ message: "Articel Updated Successfully." });
            } else {
                return res.status(500).json(err);
            }
        }
    );
});

router.get("/deleteArticle/:id", auth.authenticateToken, (req, res) => {
    const id = req.params.id;
    var query = "delete from articleHub.article where id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Article id does not found" });
            }
            return res.status(200).json({ message: "Articel Deleted Successfully." });
        } else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;
