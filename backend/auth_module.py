import os
from dotenv import load_dotenv
import sendgrid
from sendgrid.helpers.mail import Mail
import secrets

load_dotenv()

try: 
    mail_client = sendgrid.SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
except Exception as e:
    print("Error in email_client as: ", e)

def send_otp_email(receiver_email, otp) -> bool:
    message = Mail(
        from_email="chitkararudra946@gmail.com",
        to_emails=receiver_email,
        subject="OTP FOR Our Cricket APP",
        html_content=f"<strong>Your OTP is {otp}. Enjoyy Buddy.</strong>",
    )
    try:
        sg = mail_client
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        return True
    except Exception as e:
        print(e)
    return False