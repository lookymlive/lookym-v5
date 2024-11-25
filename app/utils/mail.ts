import nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN;
const MAIL_USER = process.env.MAILTRAP_USER;
const MAIL_PASS = process.env.MAILTRAP_PASS;
const VERIFICATION_MAIL = process.env.VERIFICATION_MAIL;

if (!TOKEN || !MAIL_USER || !MAIL_PASS || !VERIFICATION_MAIL) {
  throw new Error("Missing environment variables for mail setup.");
}

const client = new MailtrapClient({ token: TOKEN });

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

type Options = { to: string; name: string; link: string };

const sendVerificationMail = async (options: Options) => {
  try {
    if (process.env.NODE_ENV === "development") {
      await transport.sendMail({
        to: options.to,
        from: VERIFICATION_MAIL,
        subject: "Welcome Email",
        html: `<div>
                 <p>Please click on <a href="${options.link}">this link</a> to verify your account.</p>
               </div>`,
      });
    } else {
      await client.send({
        from: { email: VERIFICATION_MAIL, name: "Lookym Support" },
        to: [{ email: options.to }],
        subject: "Welcome Email",
        html: `<div>
                 <p>Please click on <a href="${options.link}">this link</a> to verify your account.</p>
               </div>`,
        category: "Integration Test",
      });
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

const sendPassResetMail = async (options: Options) => {
  try {
    await transport.sendMail({
      to: options.to,
      from: VERIFICATION_MAIL,
      subject: "Password Reset Request",
      html: `<div>
               <p>Please click on <a href="${options.link}">this link</a> to reset your password.</p>
             </div>`,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

const mail = {
  sendVerificationMail,
  sendPassResetMail,
};

export default mail;

