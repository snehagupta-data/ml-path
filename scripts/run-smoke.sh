#!/usr/bin/env bash
# Build, serve the production preview, run the smoke test, then stop the server.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build

PORT=4173
npm run preview -- --port "$PORT" --strictPort --host 127.0.0.1 > /tmp/mlpath-preview.log 2>&1 &
PREVIEW_PID=$!
trap 'kill $PREVIEW_PID 2>/dev/null || true' EXIT

# Wait for the server to answer (max ~15s)
for _ in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/"; then
    break
  fi
  sleep 0.5
done

node scripts/smoke-test.mjs "$PORT"
