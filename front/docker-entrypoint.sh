#!/bin/sh
cat > /app/dist/browser/assets/config.js << EOF
window.dynamicConf = {
  BACKEND_URL: "${BACKEND_URL}"
};
EOF

exec serve -s /app/dist/browser -l 4200
