#!/bin/sh

sed -i 's#__USE_PROXY__#'"$USE_PROXY"'#g' /usr/share/caddy/html/index.html
sed -i 's#__PROXY_URL__#'"'$PROXY_URL'"'#g' /usr/share/caddy/html/index.html

exec "$@"