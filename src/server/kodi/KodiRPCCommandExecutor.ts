import * as http from "http";

import { Promise } from 'bluebird';

import { Config } from '../Config';

export class KodiRPCCommandExecutor {
  private config : Config;

  constructor(config : Config) {
      this.config = config;
  }

  public stop() : Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: this.config.get('kodiRPCPort'),
        path: '/jsonrpc',
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
          'Content-Type': 'application/json'
        },
        auth: `${this.config.get('kodiRPCUser')}:${this.config.get('kodiRPCPassword')}`
      };

      let request =
        http.request(options, (response) => {
          response
            .on('end', () => {
              console.log(`kodi response: ok`);
              resolve(`kodi response: ok`)
            })
            .on('error', (e) => {
              console.log(`kodi response: problem with response: ${e.message}`);
              reject(`kodi response: problem with response: ${e.message}`)
            });
        })
        .on('aborted', () => resolve(`kodi RPC command aborted`))
        .on('response', (response) => resolve(`kodi RPC command response received`))
        .on('end', () => resolve(`kodi RPC command ok`))
        .on('error', (e) => reject(`kodi RPC command problem: ${e.message}`));

      request.write(JSON.stringify({ jsonrpc: "2.0", method: "Application.Quit", id: 1} ));
      request.end();
    });
  }
}
