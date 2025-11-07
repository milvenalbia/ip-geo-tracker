# IP Geo Tracker Guide

# Laravel

```
 git clone https://github.com/milvenalbia/ip-geo-tracker.git
```

Note: 
Make sure to update the php version used in the composer.json

```
  cd geo-api
  composer install

  php artisan migrate:fresh --seed
  php artisan serve
```
In .env file
```
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=ip_geolocation_db
  DB_USERNAME=root
  DB_PASSWORD=
```

# React

```
  cd geo-web
  npm install
  npm run dev
```

