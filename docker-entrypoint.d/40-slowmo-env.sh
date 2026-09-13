#!/bin/sh
# Runs under the stock nginx image entrypoint (/docker-entrypoint.d/).
set -eu

js_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

API_URL="${VITE_API_BASE_URL:-}"
if [ -z "$API_URL" ]; then
  echo "slowmo: VITE_API_BASE_URL is required at container runtime (set it in server .env)." >&2
  exit 1
fi

case "$API_URL" in
  http://localhost*|http://127.0.0.1*)
    echo "slowmo: VITE_API_BASE_URL must be a public API URL, not localhost. Got: $API_URL" >&2
    exit 1
    ;;
esac

cat > /usr/share/nginx/html/env.js <<EOF
window.__SLOWMO_ENV__ = {
  VITE_API_BASE_URL: "$(js_escape "$API_URL")",
  VITE_RAZORPAY_KEY_ID: "$(js_escape "${VITE_RAZORPAY_KEY_ID:-}")",
  VITE_APP_ENV: "$(js_escape "${VITE_APP_ENV:-prod}")"
};
EOF

echo "slowmo: wrote /env.js with API ${API_URL}"
