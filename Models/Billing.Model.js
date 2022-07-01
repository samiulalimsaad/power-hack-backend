import { model, Schema } from "mongoose";

// Create a Schema corresponding to the document interface.
const BillingSchema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        paidAmount: { type: String, required: true },
    },
    { timestamps: true }
);

// Create a Model.
export const Bill = model("Order", BillingSchema);
