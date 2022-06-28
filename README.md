SAML App
======

## Purpose
* Demo SAML login flow

## How to run backend
```
npm i               ## install dependencies
npm start           ## run (in production mode)
npm run start:dev   ## run (in dev mode)
```

## How to test
* Run backend
* Browse 'http://localhost:3000' on web browser
  1. Click 'metadata.xml' link and check metadata.xml
  2. Click 'login' link and check 'Hello __someone__@did.net!' message
  3. Click 'logout' link and check 'Bye~ __someone__@did.net!' message

## Tools
* node v14.18.2

## Ref
* https://github.com/Clever/saml2
