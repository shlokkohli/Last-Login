import { Client, sender } from './mailTrap.config.js'
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from './emailTemplates.js'
import { ApiError } from '../ApiError.js'

export const sendVerificationEmail = async (email, verificationToken) => {

    const recipients = [{email}];

    try {
        const response = await Client.send({
            from: sender,
            to: recipients,
            subject: "Email Verification Code",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        })
        return response;
    } catch (error) {
        console.log(error)
        throw new ApiError(500, `Error sending verification email: ${error}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {

    const recipients = [{email}];

    try {
        const response = await Client.send({
            from: sender,
            to: recipients,
            subject: "Welcome to Our App!",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
        })
        return response;
    } catch (error) {
        throw new ApiError(500, `Error sending Welcome page: ${error}`)
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {

    const recipients = [{email}]

    try {
        const response = await Client.send({
            from: sender,
            to: recipients,
            subject: "Reset Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Reset Password",
        })
        return response;
    } catch (error) {
        throw new ApiError(500, `Error trying to reset the password: ${error}`)
    }

}

export const sendResetSuccessfullPassword = async(email) => {

    const recipients = [{email}]

    try {
        const response = await Client.send({
            from: sender,
            to: recipients,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset Password",
        })
        return response;
    } catch (error) {
        throw new ApiError(500, `Error password reset success email: ${error}`)
    }

}