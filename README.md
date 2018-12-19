# miniDevFest Ostrava 2019
The official website of miniDevFest Ostrava 2019

## Requirements

- `yarn`
- `firebase tools`

## Local server

Run `yarn start` to start local development server. Your server will run on `http://localhost:8000/`.

## Deployment

Run these commands for deployment:

```
yarn build
firebase use release
firebase deploy --only hosting
```
