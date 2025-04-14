const { Resend } = require('resend');
const resend = new Resend(process.env.Resend_API_KEY);

const sendVerificationEmail = async (to, verificationCode) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'GoMarkets <onboarding@resend.dev>',
      to: to,
      subject: 'Email Verification - GoMarkets',
      html: `
        <h1>Welcome to GoMarkets!</h1>
        <p>Please verify your email address by entering the following verification code:</p>
        <h2 style="color: #4a90e2;">${verificationCode}</h2>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      `
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return false;
    }

    console.log('Verification email sent:', data);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail
}; 