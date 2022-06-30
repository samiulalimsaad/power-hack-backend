import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.post("/api/registration");
app.post("/api/login");

app.get("/api/billing-list");
app.post("/api/add-billing");
app.patch("/api/update-billing/:id");
app.delete("/api/delete-billing/:id");

app.listen(PORT, () => {
    console.log("app is runing");
});
