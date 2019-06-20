from django.conf import settings
from django.core.mail import send_mail, EmailMessage
import mimetypes


def send_email(dest, title, message, attachment=[]):
    mail = EmailMessage(title, message, to=[dest], from_email=settings.EMAIL_USER)
    if attachment:
        for a in attachment:
            mail.attach(a[0], a[1], a[2])
    mail.send()
