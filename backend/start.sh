#!/bin/bash
python3 -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
