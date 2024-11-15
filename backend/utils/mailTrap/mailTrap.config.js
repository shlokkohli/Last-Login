import { MailtrapClient } from 'mailtrap';
import dotenv from 'dotenv';

// Correct path to the .env file
dotenv.config();

const Token = process.env.MAILTRAP_TOKEN;

export const Client = new MailtrapClient({
  token: Token,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};


// const recipients = [
//   {
//     email: "shlokkohli11@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "Test Email",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);