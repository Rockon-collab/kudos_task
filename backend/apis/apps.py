from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apis"

    def ready(self):
        from apis.scheduler import schedule_weekly_reset
        schedule_weekly_reset()


# Uncomment the following and comment
# the above function for the testing purpose

# class ApiConfig(AppConfig):
#     default_auto_field = "django.db.models.BigAutoField"
#     name = "apis"

#     def ready(self):
#         from apis.scheduler import schedule_test_reset
#         schedule_test_reset()
