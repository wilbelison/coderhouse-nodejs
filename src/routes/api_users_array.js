import { Router } from "express";

const router = Router();

let users = [
  {
    id: 1,
    name: "Lilian",
    last_name: "de Aquino Menezes",
    age: 27,
    email: "lilian@email.com",
  },
  {
    id: 2,
    name: "Wilbelison",
    last_name: "Santos Costa Junior",
    age: 39,
    email: "wil@email.com",
  },
  {
    id: 3,
    name: "Pandora",
    last_name: "Lawrence",
    age: 4,
    email: "dorinha@email.com",
  },
  {
    id: 4,
    name: "Pantera",
    last_name: "Menezes",
    age: 18,
    email: "tero@email.com",
  },
  {
    id: 5,
    name: "Mufasa",
    last_name: "A",
    age: 1,
    email: "mufinha@email.com",
  },
  {
    id: 6,
    name: "Neverend",
    last_name: "Hanna",
    age: 6,
    email: "end@email.com",
  },
];

let id = 7;

function isArray(obj) {
  return !!obj && obj.constructor === Array;
}

// GET - Busca usuários
router.get("/:id?", (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(200).json(users);
  } else {
    const user = users.find((user) => user.id === parseInt(userId));
    if (user) {
      return res.status(200).json(user);
    }
  }
  return res.status(400).json({ status: "error", message: "User not found" });
});

// POST - Cria um novo usuário
router.post("/", (req, res) => {
  const body = req.body;

  if (!isArray(body)) {
    body.id = id;
    if (!body.name || !body.last_name || !body.age || !body.email) {
      return res.status(400).json({ status: "error", message: "Invalid data" });
    }
    users.push(body);
    id++;
    return res.status(201).json({
      status: "success",
      message: `User ${body.id} created!`,
      user: body,
    });
  } else {
    body.forEach((user) => {
      user.id = id;
      users.push(user);
      id++;
    });
    return res.status(201).json({
      status: "success",
      message: `${body.length} users created!`,
      users: body,
    });
  }
});

// PUT - Atualiza um usuário
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const body = req.body;

  const user = users.find((user) => user.id === parseInt(userId));

  if (user) {
    Object.assign(user, body); // Atualiza o usuário com os novos dados
    return res.status(200).json({
      status: "success",
      message: `User ${userId} updated!`,
      user,
    });
  }

  return res.status(400).json({ status: "error", message: "User not found" });
});

// DELETE - Remove um usuário
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex((user) => user.id === parseInt(userId));

  if (userIndex !== -1) {
    const removedUser = users.splice(userIndex, 1)[0];
    return res.status(200).json({
      status: "success",
      message: `User ${userId} deleted!`,
      user: removedUser,
    });
  }

  return res.status(400).json({ status: "error", message: "User not found" });
});

export default router;