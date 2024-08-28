const express = require("express");

const app = express();
const port = 3000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}: http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [];
let uid = 0;

// POST http://localhost:3000/users
/* BODY
  {
    "firstName": "Wilbelison",
    "lastName": "Junior"
  }
*/

app.post("/users", (req, res) => {
  let user = req.body;

  if (!user.firstName || !user.lastName) {
    return res.status(400).send({
      stats: "error",
      message: "The firstName and lastName are required!",
    });
  }

  user.id = uid;
  users.push(user);
  uid++;

  res.status(200).send({ status: "success", message: "User created!" });
});

// GET http://localhost:3000/users

app.get("/users", (req, res) => {
  res.json(users);
});
