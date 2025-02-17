import os
import django
from django_rq import get_worker

# Set up Django before importing anything else
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()  # Initialize Django


def start_worker():
    """Starts the Django RQ worker."""
    worker = get_worker()  # Get the worker instance
    worker.work()  # Start the worker process


if __name__ == "__main__":
    start_worker()
