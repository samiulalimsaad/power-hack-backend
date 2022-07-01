import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { BillModel } from "./Models/Billing.Model.js";
import {
    BillValidationSchema,
    SignUpValidationSchema,
} from "./utils/validationSchema.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "./Models/User.Model.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const SALT = bcrypt.genSaltSync(10);

app.post("/api/registration", async (req, res) => {
    try {
        const data = SignUpValidationSchema.validateSync(req.body, {
            abortEarly: true,
        });

        const password = bcrypt.hashSync("B4c0//", SALT);
        data.password = password;

        const newUser = new UserModel(data);
        const user = await newUser.save();

        const token = jwt.sign(req.body, process.env.ACCESS_TOKEN, {
            expiresIn: "1d",
        });
        res.json({
            token,
            success: true,
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.errors?.length ? error.errors : error.message,
        });
    }
});

app.get("/api/billing-list", async (req, res) => {
    try {
        console.log(req.query.email);
        const bills = await BillModel.find({ email: req.query.email });
        console.log(bills);
        res.status(200).json({ success: true, bills });
    } catch (error) {
        res.status(502).json({ success: false, message: error.message });
    }
});

app.post("/api/add-billing", async (req, res) => {
    try {
        const data = BillValidationSchema.validateSync(req.body, {
            abortEarly: false,
        });
        const bill = new BillModel(data);
        await bill.save();
        res.status(200).json({ success: true, bill });
    } catch (error) {
        res.status(403).json({ success: false, message: error.errors });
    }
});

app.patch("/api/update-billing/:id", async (req, res) => {
    try {
        const bill = await BillModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        res.status(200).json({ success: true, bill });
    } catch (error) {
        res.status(502).json({ success: false, message: error.message });
    }
});

app.delete("/api/delete-billing/:id", async (req, res) => {
    try {
        const bill = await BillModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, bill });
    } catch (error) {
        res.status(502).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
    mongoose.connect(
        process.env.DATABASE_URL,
        {
            useNewUrlParser: true,
            autoIndex: true, //make this also true
        },
        () => {
            console.log("Database is connected");
        }
    );
});
