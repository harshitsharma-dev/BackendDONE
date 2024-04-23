
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'harshit@43130'
});

app.post('/register', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // Log the received data for debugging
    console.log("Received data:", email, username, password);

    con.query("INSERT INTO user (id, email, username, password) VALUES (?, ?, ?, ?)", [uuidv4(), email, username, password], 
        (err, result) => {
            if(err){
                console.log("Database error:", err); // Log database error
                res.status(500).send({ message: "Internal server error" });
            } else {
                if(result && result.affectedRows > 0){
                    res.status(200).send({ message: "Account created successfully" });
                } else {
                    res.status(400).send({ message: "ENTER CORRECT ASKED DETAILS!" });
                }
            }
        }
    );
});


app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    con.query("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], 
        (err, result) => {
            if(err){
                req.setEncoding({err: err});
            }else{
                if(result.length > 0){
                    res.send(result);
                }else{
                    res.send({message: "WRONG USERNAME OR PASSWORD!"})
                }
            }
        }
    )
})

app.listen(3001, () => {
    console.log("running backend server");
})