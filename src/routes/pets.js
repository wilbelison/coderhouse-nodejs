import { Router } from "express";

const router = Router();

const pets = [];

router.get("/", (req, res) => {
  res.status(200).json(pets);
});

router.post("/", (req, res) => {
  const body = req.body;

  if (!body.name || !body.email) {
    return res
      .status(400)
      .json({ status: "error", message: "Name and email are required." });
  }

  pets.push(body);

  return res.status(201).json({
    status: "success",
    message: `${body.name} and ${body.email} are created!`,
  });
});

export default router;
