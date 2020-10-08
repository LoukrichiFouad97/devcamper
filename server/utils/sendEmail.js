import nodemailer from "nodemailer";
import { config } from "../config/config";

export const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: config.email.smtp.host,
		port: config.email.smtp.port,
		auth: {
			user: config.email.smtp.email,
			pass: config.email.smtp.password,
		},
	});

	const message = {
		from: `${config.email.from_name} <${config.email.from_email}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await transporter.sendMail(message);
};
