from datetime import datetime
import pytz
from django_rq import get_scheduler


IST = pytz.timezone("Asia/Kolkata")


def schedule_test_reset():
    """Schedules the kudos reset every 2 minutes for testing in IST timezone"""
    scheduler = get_scheduler("default")
    scheduler.schedule(
        scheduled_time=datetime.now(IST),
        func="apis.tasks.reset_weekly_kudos",
        interval=120,
        repeat=None,
    )


def schedule_weekly_reset():
    """Schedules the weekly kudos reset every Monday at midnight."""
    scheduler = get_scheduler("default")
    scheduler.cron(
        "0 0 * * 1",  # Runs at midnight (00:00) every Monday
        func="apis.tasks.reset_weekly_kudos",
        repeat=None,
    )
