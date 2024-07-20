import { verifyToken } from "./../controllers/verify.token";
import login from "@/controllers/login";
import register from "@/controllers/register";
import { checkpoint } from "@/controllers/verify.token";
import { methodNotAllowed } from "@/middlewares";
import express from "express";
const router = express.Router();

router.post("/login", methodNotAllowed("post"), login);
router.post("/register", methodNotAllowed("post"), register);
router.post("/checkpoint", methodNotAllowed("post"), checkpoint);
router.post("/verify-token", methodNotAllowed("post"), verifyToken);

export default router;
