import { Router } from "express";

const router = Router();

let users = [];
let id = 1;

router.get("/", (req, res) => {
  res.status(200).json(users);
});

router.post("/", (req, res) => {
  const body = req.body;
  body.id = id;

  if (!body.name || !body.last_name || !body.age || !body.email) {
    return res.status(400).json({ status: "error", message: "Error!" });
  }

  users.push(body);
  id++;

  return res.status(201).json({
    status: "success",
    message: `User ${body.id} created!`,
    user: body,
  });
});

router.put("/", (req, res) => {
  const body = req.body;

  if (!body.id) {
    return res.status(400).json({ status: "error", message: "Error!" });
  }

  users.forEach((user) => {
    if (user.id === body.id) {
      console.log(user.id);
      for (const [key, value] of Object.entries(body)) {
        user[key] = value;
      }
      return res.status(201).json({
        status: "success",
        message: `User ${body.id} updated!`,
        user,
      });
    }
  });

  return res.status(400).json({ status: "error", message: "Error!" });
});

router.delete("/", (req, res) => {
  const body = req.body;

  if (body.id) {
    console.log(body.id);
    users = users.filter((user) => user.id !== body.id);
    return res.status(201).json({
      status: "success",
      message: `User ${body.id} deleted!`,
      user: body,
    });
  }

  return res.status(400).json({ status: "error", message: "Error!" });
});

export default router;
