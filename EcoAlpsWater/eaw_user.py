from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class EAWUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    institute = models.TextField(blank=True, null=True)


@receiver(post_save, sender=User)
def create_user_eawuser(sender, instance, created, **kwargs):
    if created:
        EAWUser.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_eawuser(sender, instance, **kwargs):
    instance.eawuser.save()
