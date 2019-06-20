from django.conf import settings
from django.core.mail import send_mail


def send_email(dest, title, message):
    send_mail(
        title,
        message,
        settings.EMAIL_USER,
        [dest]
    )
