import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, lname, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const recipient = process.env.CONTACT_EMAIL || "poprika.official@gmail.com";

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transport.sendMail({
      from: `"${name} ${lname || ""}" <${email}>`,
      replyTo: email,
      to: recipient,
      subject: `[Poprika Contact] ${subject}`,
      text: `Name: ${name} ${lname || ""}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name} ${lname || ""}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    return NextResponse.json({ success: true, data: { message: "Message sent! We'll get back to you within 24 hours." } });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
