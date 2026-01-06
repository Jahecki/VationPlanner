import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
); // timestamps doda pola createdAt i updatedAt automatycznie

// Sprawdzamy czy model już istnieje, żeby nie kompilować go dwa razy (wymóg Next.js)
const User = models.User || model("User", UserSchema);

export default User;
