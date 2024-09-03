import prisma from "@/config/db";
import { DefaultSenderAddress, transporter } from "@/config/email";
import { EmailSendingSchema } from "@/schema";
import { Response, Request, NextFunction } from "express";

// send Email
export const SendEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = EmailSendingSchema.safeParse(req.body);
    if (parseBody.error) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    // create email options
    const { sender, recipient, body, subject, source } = parseBody?.data;
    const from = sender || DefaultSenderAddress;
    const emailOptions = {
      from,
      to: recipient,
      text: body,
      subject,
    };

    // send email throw transport
    const { rejected } = await transporter.sendMail(emailOptions);
    if (rejected.length) {
      console.log(`rejected ${rejected}`);
      return res.status(500).json({ error: "Failed" });
    }

    // set data to database
    await prisma.email.create({
      data: {
        sender: from,
        recipient,
        subject,
        body,
        source,
      },
    });

    // return success
    return res
      .status(200)
      .json({ code: 200, message: "Email Send Successfully" });
  } catch (error) {
    console.log(`Errors while send email -` + error);
    next(error);
  }
};

export const getEmails = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await prisma.email.findMany();
    return res.status(200).json({
      code: 200,
      message: "Data Retrieve Successfully!",
      data,
    });
  } catch (error) {
    console.log(`Error while getting emails - ${error}`);
    next(error);
  }
};
