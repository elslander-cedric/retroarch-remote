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
            .on('end', () => resolve(`kodi rpc command: ok`))
            .on('error', (e) => reject(`kodi rpc command: problem with response: ${e.message}`));
        }).on('error', (e) => reject(`kodi rpc command: problem with request: ${e.message}`));

      request.write(JSON.stringify({ jsonrpc: "2.0", method: "Application.Quit", id: 1} ));
      request.end();
    });
  }
}
