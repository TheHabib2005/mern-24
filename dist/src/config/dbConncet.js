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
exports.conncetToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const conncetToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb+srv://cdxhabib:poiuuiop@cluster0.rr7ldlq.mongodb.net/mern-24?retryWrites=true&w=majority&appName=Cluster0");
        console.log("db conncet");
    }
    catch (error) {
        console.log(error);
        console.log("db conncet failed");
        process.exit(1);
        return new Error(error.message);
    }
});
exports.conncetToDb = conncetToDb;
