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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const client_1 = __importDefault(require("@repo/db/client"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("auth header not found");
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("token not found");
        }
        const decode = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        const userId = decode;
        const user = yield client_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        req.userId = userId;
        next();
    }
    catch (e) {
        res.status(403).json({
            message: "Unauthorized",
        });
        return;
    }
});
exports.authMiddleware = authMiddleware;
