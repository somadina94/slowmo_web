#!/bin/sh
# Runs under the stock nginx image entrypoint (/docker-entrypoint.d/).
# Must never fail the entrypoint — a non-zero exit can leave the site on 502.
set -u

js_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

API_URL="${VITE_API_BASE_URL:-}"
KEY_ID="${VITE_RAZORPAY_KEY_ID:-}"
APP_ENV="${VITE_APP_ENV:-prod}"

if [ -z "$API_URL" ]; then
  echo "slowmo: VITE_API_BASE_URL unset — keeping image-baked /env.js if present" >&2
  exit 0
fi

case "$API_URL" in
  http://localhost*|http://127.0.0.1*)
    echo "slowmo: warning: VITE_API_BASE_URL looks like localhost: $API_URL" >&2
    ;;
esac

cat > /usr/share/nginx/html/env.js <<EOF
window.__SLOWMO_ENV__ = {
  VITE_API_BASE_URL: "$(js_escape "$API_URL")",
  VITE_RAZORPAY_KEY_ID: "$(js_escape "$KEY_ID")",
  VITE_APP_ENV: "$(js_escape "$APP_ENV")"
};
EOF

echo "slowmo: wrote /env.js → ${API_URL}"
exit 0
