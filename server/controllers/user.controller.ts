import { Request, Response } from 'express';
import User from '../models/User';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { Name, Age, Job, Email, Phone, Password } = req.body;

    if (!Name || !Email || !Phone || !Password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Insert your user creation logic here (e.g. hashing password)
    const newUser = {
      Name,
      Age,
      Job,
      Email,
      Phone,
      Password // <- hash this in real scenarios
    };

    // Save to DB (adjust for your schema)
    await User.create(newUser);

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



