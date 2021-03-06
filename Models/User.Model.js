import mongoose from "mongoose";
const { model, Schema } = mongoose;
// Create a Schema corresponding to the document interface.
const userSchema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

// Create a Model.
export const UserModel = model("User", userSchema);
