import * as child_process   from 'child_process';

import { Promise }          from 'bluebird';
import { ChildProcess }     from 'child_process';

import { ProcessExecution } from '../ProcessExecution';
import { ProcessLauncher }  from '../ProcessLauncher';

export class RetroArchLauncher implements ProcessLauncher {

  public launch(args ?: Array<string>) : Promise<ProcessExecution> {
    const command = `/usr/bin/retroarch`;

    let retroarch =
      child_process.spawn(command, args, {
        stdio: "inherit",
        detached: false,
        shell: false
      }).on('close', (code, signal) => {
          console.log(`retroarch closed with code ${code} due to signal ${signal}`);
      }).on('exit', (code, signal) => {
          console.log(`retroarch exited with code ${code} due to signal ${signal}`);
      }).on('error', (error) => {
          console.error(`retroarch error ${error}`);
      });

    return Promise.resolve(new ProcessExecution(retroarch));
  }
}
