import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
  getUsers,
} from "@/controllers";
import { methodNotAllowed } from "@/middlewares";
import { originGuard } from "@/middlewares/originGuard";
import express from "express";
const router = express.Router();

router.post(
  "/users",
  originGuard(["http://localhost:4003"]),
  methodNotAllowed("post"),
  createUser
);
router.get("/users", methodNotAllowed("get"), getUsers);
router.put("/users/:userId", methodNotAllowed("put"), updateUser);
router.delete("/users/:userId", methodNotAllowed("delete"), deleteUser);
router.get("/users/:userId", methodNotAllowed("get"), getUserById);

export default router;
