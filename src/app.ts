import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Mini Social Feed API Running");
});

export default app;