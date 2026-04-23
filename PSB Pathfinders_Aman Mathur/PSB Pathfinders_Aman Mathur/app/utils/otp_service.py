import random
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

class OTPService:
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SENDER_EMAIL = "test.php.15.7.2024@gmail.com"
    # Use environment variable for security
    SMTP_PASSWORD = os.getenv("SMTP_APP_PASSWORD", "")

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    @staticmethod
    def verify_otp(otp, actual_otp):
        return otp == actual_otp

    @staticmethod
    def send_email(receiver_email: str, subject: str, body: str):
        if not OTPService.SMTP_PASSWORD:
            print(f"[EMAIL MOCK] To: {receiver_email} | Subject: {subject} | Body: {body}")
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = OTPService.SENDER_EMAIL
            msg['To'] = receiver_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(OTPService.SMTP_SERVER, OTPService.SMTP_PORT)
            server.starttls()
            server.login(OTPService.SENDER_EMAIL, OTPService.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False

    @staticmethod
    def send_otp_email(receiver_email: str, otp: str):
        subject = "Your Login OTP - PSB Pathfinders"
        body = f"Hello,\n\nYour OTP for logging into PSB Pathfinders is: {otp}\n\nThis OTP is valid for 10 minutes.\n\nRegards,\nPSB Pathfinders Team"
        return OTPService.send_email(receiver_email, subject, body)

    @staticmethod
    def send_welcome_email(receiver_email: str, full_name: str, password: str):
        subject = "Welcome to PSB Pathfinders!"
        body = f"Hello {full_name},\n\nWelcome to PSB Pathfinders! Your account has been successfully created.\n\nYour login credentials are:\nEmail: {receiver_email}\nPassword: {password}\n\nPlease use these credentials to log in and access your dashboard.\n\nRegards,\nPSB Pathfinders Team"
        return OTPService.send_email(receiver_email, subject, body)

