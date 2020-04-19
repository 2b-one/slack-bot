# Slack bot

Simple bot application to take on some work related routines.

## Development

To maintain a communication between dev app and slack an external url is required.
The easiest way to do it is to use [ngrok](https://www.npmjs.com/package/ngrok):

```
yarn start
ngrok 3000
```

Once ngrok is running use the forwarding url in the app.
