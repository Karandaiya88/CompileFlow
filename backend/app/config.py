"""
App configuration -- reads from environment variables only, per
Security.md Section 2: no secrets hardcoded, .env is git-ignored.
"""

import os

from dotenv import load_dotenv

load_dotenv()

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
ENV = os.getenv("ENV", "development")
