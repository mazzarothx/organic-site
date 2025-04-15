import { Resend } from "resend";
import ConfirmEmail from "../_components/email/confirm-email";
import PasswordReset from "../_components/email/password-reset-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "suporte@99boost.io",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: "suporte@99boost.io",
    to: email,
    subject: "Reset your password",
    react: <PasswordReset url={resetLink} />,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "suporte@99boost.io",
    to: email,
    subject: "Confirm your email",
    react: <ConfirmEmail url={confirmLink} />,
  });
};
