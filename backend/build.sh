#!/usr/bin/env bash
# Build script for Render (alternative to Docker deployment)
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt
pip install inspireface
