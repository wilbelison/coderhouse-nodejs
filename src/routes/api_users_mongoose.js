import { Router } from "express";
import mongoose from "mongoose";

const router = Router();
mongoose.connect("mongodb://localhost:27017/usersDB", { useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

router.get("/:id?", async (req, res) => {
  const userId = req.params.id;

  try {
    if (!userId) {
      const users = await User.find();
      return res.status(200).json(users.map(({ _id, name, last_name, age, email }) => ({
        id: _id, name, last_name, age, email,
      })));
    }

    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({
        id: user._id, name: user.name, last_name: user.last_name, age: user.age, email: user.email,
      });
    }
    
    return res.status(400).json({ status: "error", message: "User not found" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  const body = req.body;

  try {
    if (!Array.isArray(body)) {
      const newUser = new User(body);
      await newUser.save();
      return res.status(201).json({
        status: "success",
        message: `User ${newUser._id} created!`,
        user: { id: newUser._id, ...newUser.toObject() },
      });
    }

    const users = await User.insertMany(body);
    return res.status(201).json({
      status: "success",
      message: `${users.length} users created!`,
      users: users.map(({ _id, name, last_name, age, email }) => ({
        id: _id, name, last_name, age, email,
      })),
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const body = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true });
    if (updatedUser) {
      return res.status(200).json({
        status: "success",
        message: `User ${userId} updated!`,
        user: { id: updatedUser._id, ...updatedUser.toObject() },
      });
    }
    
    return res.status(400).json({ status: "error", message: "User not found" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      return res.status(200).json({
        status: "success",
        message: `User ${userId} deleted!`,
        user: { id: deletedUser._id, ...deletedUser.toObject() },
      });
    }
    
    return res.status(400).json({ status: "error", message: "User not found" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;