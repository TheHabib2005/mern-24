"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpController = void 0;
const errorHandler_1 = __importDefault(require("../../middleware/errorHandler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiResponse_1 = require("../../../utils/apiResponse");
const emailTransport_1 = __importDefault(require("../../../utils/emailTransport"));
const user_model_1 = __importDefault(require("../../config/models/user.model"));
const fs_1 = __importDefault(require("fs"));
const SignUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlContent = fs_1.default.readFileSync("./public/email.html", "utf8");
    let have_a_access_api_key = req.headers.accesskey === process.env.SECRIET_KEY_FOR_API_USE;
    if (!have_a_access_api_key) {
        let err = new errorHandler_1.default("you have no access key", 400);
        return next(err);
    }
    const { username, email, password } = req.body;
    const user = yield user_model_1.default.findOne({ email: email, username: username });
    if (user && user.email === email && user.username === username) {
        let err = new errorHandler_1.default("user already exist", 400);
        return next(err);
    }
    // hasing password
    const hashPassword = bcrypt_1.default.hashSync(password, 10);
    const newUser = yield user_model_1.default.create({
        username,
        email,
        password: hashPassword,
    });
    var message = {
        from: "mdwear2005@gmail.com",
        to: email,
        subject: "Please Verify your Email Address",
        html: htmlContent,
    };
    let emailResponse = yield emailTransport_1.default.sendMail(message);
    if (emailResponse.messageId) {
        let response = (0, apiResponse_1.apiResponse)("user Created Successfully", 201, {
            user_id: newUser._id,
        });
        return res.json(response).status(201);
    }
    else {
        let err = new errorHandler_1.default("something went wrong", 400);
        return next(err);
    }
});
exports.SignUpController = SignUpController;
