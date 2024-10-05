import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();
const usersFilePath = path.resolve("./data/users.json");

const readUsersFromFile = async () => {
  try {
    const data = await fs.readFile(usersFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Read file error:", error);
    return [];
  }
};

const saveUsersToFile = async (users) => {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    console.error("Write file error:", error);
  }
};

router.get("/:id?", async (req, res) => {
  const { id } = req.params;
  const users = await readUsersFromFile();

  if (!id) return res.status(200).json(users);

  const user = users.find((user) => user.id === parseInt(id));
  return user
    ? res.status(200).json(user)
    : res.status(400).json({ status: "error", message: "User not found" });
});

router.post("/", async (req, res) => {
  const body = req.body;
  const users = await readUsersFromFile();

  if (!Array.isArray(body)) {
    body.id = users.length ? users[users.length - 1].id + 1 : 1;
    if (!body.name || !body.last_name || !body.age || !body.email) {
      return res.status(400).json({ status: "error", message: "Invalid data" });
    }
    users.push(body);
    await saveUsersToFile(users);
    return res.status(201).json({
      status: "success",
      message: `User ${body.id} created!`,
      user: body,
    });
  }

  body.forEach((user) => {
    user.id = users.length ? users[users.length - 1].id + 1 : 1;
    users.push(user);
  });
  await saveUsersToFile(users);
  return res.status(201).json({
    status: "success",
    message: `${body.length} users created!`,
    users: body,
  });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const users = await readUsersFromFile();

  const userIndex = users.findIndex((user) => user.id === parseInt(id));

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...body };
    await saveUsersToFile(users);
    return res.status(200).json({
      status: "success",
      message: `User ${id} updated!`,
      user: users[userIndex],
    });
  }

  return res.status(400).json({ status: "error", message: "User not found" });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const users = await readUsersFromFile();

  const userIndex = users.findIndex((user) => user.id === parseInt(id));

  if (userIndex !== -1) {
    const removedUser = users.splice(userIndex, 1)[0];
    await saveUsersToFile(users);
    return res.status(200).json({
      status: "success",
      message: `User ${id} deleted!`,
      user: removedUser,
    });
  }

  return res.status(400).json({ status: "error", message: "User not found" });
});

export default router;