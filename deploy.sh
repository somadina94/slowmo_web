#!/usr/bin/env bash
# Slow Mo Web — production deploy (pull GHCR image or build locally)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

COMPOSE=(docker compose -f docker-compose.prod.yml --env-file .env)
DOCKER=(docker)

if [ ! -f .env ]; then
  echo "Missing .env — copy from .env.prod.example and fill values before deploy."
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [ -z "${VITE_API_BASE_URL:-}" ]; then
  echo "VITE_API_BASE_URL is required in .env (e.g. https://api.slowmo.jahbyte.com/api/v1)."
  exit 1
fi

# Prefer GHCR_TOKEN; accept legacy GHCR_PULL_TOKEN.
if [ -z "${GHCR_TOKEN:-}" ] && [ -n "${GHCR_PULL_TOKEN:-}" ]; then
  export GHCR_TOKEN="$GHCR_PULL_TOKEN"
fi

if ! docker info >/dev/null 2>&1; then
  COMPOSE=(sudo docker compose -f docker-compose.prod.yml --env-file .env)
  DOCKER=(sudo docker)
fi

ghcr_login() {
  user="${GHCR_USERNAME:-}"
  token="${GHCR_TOKEN:-}"
  if [ -z "$user" ] || [ -z "$token" ]; then
    echo "GHCR_USERNAME / GHCR_TOKEN not set — skipping docker login."
    echo "For private GHCR pulls, add a GitHub PAT (read:packages) as GHCR_TOKEN."
    return 0
  fi
  echo "Logging in to ghcr.io as ${user}..."
  echo "${token}" | "${DOCKER[@]}" login ghcr.io -u "${user}" --password-stdin
}

if [ "${DEPLOY_BUILD_LOCAL:-0}" = "1" ]; then
  echo "Building web image locally..."
  "${COMPOSE[@]}" build --pull
  echo "Starting web (recreate)..."
  "${COMPOSE[@]}" up -d --force-recreate --remove-orphans
else
  ghcr_login
  echo "Image ref: ${SLOWMO_WEB_IMAGE:-"(unset)"}"
  echo "Pulling image from registry..."
  "${COMPOSE[@]}" pull
  echo "Starting web (recreate so new digests are used)..."
  "${COMPOSE[@]}" up -d --force-recreate --remove-orphans
fi

echo "Status:"
"${COMPOSE[@]}" ps
echo

cid="$("${DOCKER[@]}" ps -aq -f name=slowmo-web-prod | head -1 || true)"
if [ -n "$cid" ]; then
  echo "Recent container logs:"
  "${DOCKER[@]}" logs --tail 80 "$cid" || true
  echo
  if ! "${DOCKER[@]}" exec "$cid" wget -qO- http://127.0.0.1/ >/dev/null 2>&1; then
    echo "WARNING: container is up but http://127.0.0.1/ failed inside the container."
    "${DOCKER[@]}" inspect "$cid" --format 'status={{.State.Status}} exit={{.State.ExitCode}} error={{.State.Error}}' || true
    exit 1
  fi
  echo "In-container HTTP check OK."
  "${DOCKER[@]}" exec "$cid" wget -qO- http://127.0.0.1/env.js || true
  echo
fi

"${DOCKER[@]}" image inspect "${SLOWMO_WEB_IMAGE:-slowmo-web:prod}" \
  --format '{{.Id}} {{index .RepoDigests 0}}' 2>/dev/null || true
