from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class EAWUser(models.Model):
    COUNTRY = (
        ('Austria', 'A'),
        ('Switzerland', 'C'),
        ('France', 'F'),
        ('Germany', 'D'),
        ('Italy', 'I'),
        ('Slovenia', 'S')
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    institute = models.TextField(blank=True, null=True)
    institute_short = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=11, choices=COUNTRY)
    

@receiver(post_save, sender=User)
def create_user_eawuser(sender, instance, created, **kwargs):
    if created:
        EAWUser.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_eawuser(sender, instance, **kwargs):
    instance.eawuser.save()
