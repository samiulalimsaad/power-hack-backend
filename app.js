import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { BillModel } from "./Models/Billing.Model.js";
import {
    BillValidationSchema,
    LoginValidationSchema,
    SignUpValidationSchema,
} from "./utils/validationSchema.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "./Models/User.Model.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "unauthorized access",
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        await jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Only admin has access",
                });
            }
            req.email = decoded?.email;
            next();
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};

app.post("/api/registration", async (req, res) => {
    try {
        const data = SignUpValidationSchema.validateSync(req.body, {
            abortEarly: true,
        });

        const password = bcrypt.hashSync(data.password, 10);
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

app.post("/api/login", async (req, res) => {
    try {
        const data = LoginValidationSchema.validateSync(req.body, {
            abortEarly: true,
        });

        const user = await UserModel.findOne({ email: data.email });
        console.log(data.password, user.password);

        console.log(
            await bcrypt.compareSync(data.password.toString(), user.password)
        );

        if (bcrypt.compareSync(data.password, user.password)) {
            const token = jwt.sign(req.body, process.env.ACCESS_TOKEN, {
                expiresIn: "1d",
            });
            res.json({
                token,
                success: true,
            });
        } else {
            throw new Error("invalid Credential");
        }
    } catch (error) {
        res.json({
            success: false,
            error: error.errors?.length ? error.errors : error.message,
        });
    }
});

app.get("/api/billing-list", verifyUser, async (req, res) => {
    try {
        // const bills = await BillModel.find({ email: req.query.email });
        const bills = await BillModel.find({});
        console.log(bills);
        res.status(200).json({ success: true, bills });
    } catch (error) {
        res.status(502).json({ success: false, message: error.message });
    }
});

app.post("/api/add-billing", verifyUser, async (req, res) => {
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

app.patch("/api/update-billing/:id", verifyUser, async (req, res) => {
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

app.delete("/api/delete-billing/:id", verifyUser, async (req, res) => {
    try {
        const bill = await BillModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, bill });
    } catch (error) {
        res.status(502).json({ success: false, message: error.message });
    }
});

app.get("/", async (req, res) => {
    res.status(200).json({ success: true, message: "OK" });
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
