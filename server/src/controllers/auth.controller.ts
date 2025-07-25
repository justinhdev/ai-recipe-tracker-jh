import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";

const users: any[] = []; // temporary in-memory user store

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashedPassword };
  users.push(newUser);

  const token = generateToken(newUser.id);
  res.status(201).json({ user: { id: newUser.id, name, email }, token });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  res.json({ user: { id: user.id, name: user.name, email }, token });
};
