import * as child_process from 'child_process';

import { Promise } from 'bluebird';
import { ChildProcess } from 'child_process';

import { ProcessExecution } from '../ProcessExecution';
import { ProcessLauncher } from '../ProcessLauncher';

export class KodiLauncher implements ProcessLauncher {

  public launch(args ?: Array<string>) : Promise<ProcessExecution>  {
    const command = `xinit /usr/bin/xbmc -nocursor :0`;

    return new Promise((resolve, reject) => {
      let kodi = child_process.exec(command, (error, stdout, stderr) => {
        let processExecution = new ProcessExecution(kodi);

        if (error) {
          console.error(`kodi - exec error: ${error}`);
          reject(processExecution);
        } else {
          resolve(processExecution);
        }

        console.log(`kodi - stdout: ${stdout}`);
        console.log(`kodi - stderr: ${stderr}`);
      }).on('close', (code, signal) => {
        console.log(`kodi terminated with code ${code} by signal ${signal}`);
      }).on('error', (error) => {
        console.error(`kodi error ${error}`);
      });
    });
  }
}
