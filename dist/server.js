"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./src/middleware/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const dbConncet_1 = require("./src/config/dbConncet");
const userRouter_1 = require("./src/routes/userRouter");
const app = (0, express_1.default)();
(0, dbConncet_1.conncetToDb)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware to serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
let port = 8000;
app.listen(port, () => {
    console.log("Server is running on port " + port);
});
app.get("/", (req, res) => {
    res.send("hello world!");
});
app.use("/api/user/", userRouter_1.userRouter);
app.use(errorHandler_1.errorHandler);
app.get("*", (req, res) => {
    res.status(404).send("not found");
});
