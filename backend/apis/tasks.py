from datetime import datetime
import pytz

# Define IST timezone
IST = pytz.timezone("Asia/Kolkata")


def reset_weekly_kudos():
    """Resets kudos_left to 3 for all users at the start of each week."""
    from apis.models import User
    User.objects.update(kudos_balance=3)
    print(f"Kudos reset at {datetime.now(IST)}")
