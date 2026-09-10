#!/usr/bin/env sh
# Rebuilds and restarts the site on the VPS. Run from the repo root on the server.
set -eu
git pull --ff-only
docker compose build site
docker compose up -d
docker compose ps
