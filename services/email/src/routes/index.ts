import { getEmails, SendEmail } from "@/controllers/email.controller";
import { methodNotAllowed } from "@/middlewares";
import express from "express";
const router = express.Router();

router.post("/emails/send", methodNotAllowed("post"), SendEmail);
router.get("/emails", methodNotAllowed("get"), getEmails);

export default router;
