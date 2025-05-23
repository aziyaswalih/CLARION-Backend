import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export class EmailService {
  private transporter;

  constructor() {
    // Ensure that environment variables are available
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email credentials in environment variables.");
    }

    // Create a transporter for sending emails
    this.transporter = nodemailer.createTransport({
      service: "gmail", // You can replace this with any other email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates (for development only)
      },
      debug: true, // Enable debug mode (remove for production)
    });
  }

  // Method to send an email
  async sendEmail({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER, // From address
        to, // To address
        subject, // Email subject
        text, // Email content
      });

      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email.");
    }
  }
}
