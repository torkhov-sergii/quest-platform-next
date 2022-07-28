# questplatform


This project was generated with [superplate](https://github.com/pankod/superplate).

## Requirements
```
Ubuntu 20.04
node v16.15.0
npm 8.5.5
pm2 5.2.0
```

## Download project
```
git clone git@github.com:********.git
mv questplatform-next questplatform-next.loc
cd questplatform-next.loc
cp .env.example .env.local
npm i
```

## Running the development server
```
npm run dev
```

## Building for production
```
npm run build
pm2 delete questplatform
pm2 start npm --name "questplatform" -- start
```

## Quick deploy for production
```
pm2 start -- run start-boost
git pull origin develop && npm i && npm run build && pm2 delete questplatform && pm2 start npm --name "questplatform" -- start
```

## Config env.local
```

```

## NGINX configuration (/etc/nginx/sites-available/next.conf)
```
server {

    listen 443 ssl http2;
    listen       [::]:443 ssl http2;

    server_name dev.dron.media;

    ssl_certificate     /etc/letsencrypt/live/dev1.kyivindependent.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev1.kyivindependent.com/privkey.pem;
    ssl_protocols       TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    if ($host !~ ^dev1.kyivindependent.com$ ) {
       return 444;
    }

    if ($http_transfer_encoding ~* chunked) {
        return 444;
    }

    location ~ /\. { deny all; }
    location ~ /tmp/.* {deny all;}
    location ~ /log/.* {deny all;}
    location ~ /.*\.log {deny all; }
    location ~ /\.ssh/.* {deny all;}
    location ~ /\.ht {deny all;}
    location ~ /\.svn {deny all;}
    location ~ /\.subversion {deny all;}
    location ~ /\.git {deny all;}
    location ~ /\.env {deny all;}
    location ~ /\.(?!well-known).* {deny all;}
    location ~ /\..* {deny all;}

    location / {
      # Reverse proxy for Next server
      proxy_pass http://localhost:3020;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $host;
      proxy_set_header X-Forwarded-Port $server_port;

      # we need to remove this 404 handling
      # because of Next's error handling and _next folder
      # try_files $uri $uri/ =404;
    }

    client_max_body_size 100M;

}
```

