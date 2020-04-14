from EcoAlpsWater.lib.models.drainage_basin import DrainageBasin


class DrainageBasinUserException:

    country_db = {
        ('Lake', 'Austria'): [
            DrainageBasin.objects.filter(type='Lake', country='Germany', name='Starnberger See').first()
        ]
    }

    @staticmethod
    def get_exception(ty, user):
        return DrainageBasinUserException.country_db.get((ty[0], user.eawuser.country), [])
