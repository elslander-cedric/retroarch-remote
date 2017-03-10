import * as child_process from 'child_process';

import { Promise } from 'bluebird';
import { ChildProcess } from 'child_process';

import { ProcessExecution } from '../ProcessExecution';
import { ProcessLauncher } from '../ProcessLauncher';

export class KodiLauncher implements ProcessLauncher {

  public launch(args ?: Array<string>) : Promise<ProcessExecution>  {
    const command = `xinit /usr/bin/xbmc`;

    let kodi =
      child_process.spawn(command, args, {
        stdio: "inherit",
        detached: false,
        shell: false
      }).on('close', (code, signal) => {
          console.log(`kodi closed with code ${code} due to signal ${signal}`);
      }).on('exit', (code, signal) => {
          console.log(`kodi exited with code ${code} due to signal ${signal}`);
      }).on('error', (error) => {
          console.error(`kodi error ${error}`);
      });

    return Promise.resolve(new ProcessExecution(kodi));
  }
}
