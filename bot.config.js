/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  apps: [
    {
      name: '2b-slack-bot',
      script: './node_modules/ts-node/dist/bin.js',
      args: './src/index.ts',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      time: true, // include timestamp in logs
    },
  ],
}
