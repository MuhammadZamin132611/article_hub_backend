const express = require("express");
const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");
require("dotenv").config();
var auth = require("../services/authentication");

router.post("/addNewAppuser", (req, res) => {
    let user = req.body;
    var query =
        "select email, password, status from articleHub.appuser where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query =
                    "insert into articleHub.appuser(name,email,password,status,isDeletable) values(?,?,?,'false','true')";
                connection.query(
                    query,
                    [user.name, user.email, user.password],
                    (err, results) => {
                        if (!err) {
                            return res
                                .status(200)
                                .json({ message: "Successfully Registerd" });
                        } else {
                            res.status(500).json(err);
                        }
                    }
                );
            } else {
                return res.status(400).json({ message: "Email Already Exist." });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post("/login", (req, res) => {
    const user = req.body;
    query =
        "select email, password, status, isDeletable from articleHub.appuser where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect Email or Password" });
            } else if (results[0].status === "false") {
                return res.status(401).json({ message: "Wait for admin approval" });
            } else if (results[0].password === user.password) {
                const response = {
                    email: results[0].email,
                    isDeletable: results[0].isDeletable,
                };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
                    expiresIn: "8h",
                });
                const data = {
                    token: accessToken,
                    results: results,
                    message: "Successfully Login",
                };
                res.status(200).json(data);
            } else {
                return res
                    .status(400)
                    .json({ message: "Something went worng. Please try again later." });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get("/getAllAppuser", auth.authenticateToken, (req, res) => {
    const tokenPayload = res.locals;
    var query;
    if (tokenPayload.isDeletable === "false") {
        query =
            "select id, name, email, status, from articleHub.appuser where isDeletable='true'";
    } else {
        query =
            "select id, name, email, status from articleHub.appuser where isDeletable='true' and email !=?";
    }
    connection.query(query, [tokenPayload.email], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post("/updateUserStatus", auth.authenticateToken, (req, res) => {
    let user = req.body;
    const query =
        "UPDATE articleHub.appuser SET status=? WHERE id=? AND isDeletable='true';";

    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res
                    .status(400)
                    .json({ message: "Appuser ID does not exist or is not deletable" });
            }
            return res.status(200).json({ message: "Appuser Updated Successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post("/updateUser", auth.authenticateToken, (req, res) => {
    let user = req.body;
    const query = "UPDATE articleHub.appuser SET name=?, email=? WHERE id=?;";

    connection.query(query, [user.name, user.email, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(400).json({ message: "User ID does not exist" });
            }
            return res.status(200).json({ message: "User Updated Successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get("/checkToken", auth.authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" });
});

module.exports = router;
