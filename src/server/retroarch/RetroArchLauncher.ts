import * as child_process   from 'child_process';

import { Promise }          from 'bluebird';
import { ChildProcess }     from 'child_process';

import { ProcessExecution } from '../ProcessExecution';
import { ProcessLauncher }  from '../ProcessLauncher';

export class RetroArchLauncher implements ProcessLauncher {

  public launch(args ?: Array<string>) : Promise<ProcessExecution> {
    return new Promise((resolve, reject) => {
      let retroarch =
        child_process.spawn('/usr/bin/retroarch', args, { stdio: "inherit" })
          .on('close', (code, signal) => {
            console.log(`retroarch terminated with code ${code} by signal ${signal}`);
          })
          .on('error', (error) => {
            console.error(`retroarch error ${error}`);
          });

      resolve(new ProcessExecution(retroarch));
    });
  }
}
