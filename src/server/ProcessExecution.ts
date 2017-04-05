import * as child_process from 'child_process';
import * as ps from 'ps-node';

import { Promise } from 'bluebird';
import { ChildProcess } from 'child_process';

export class ProcessExecution {

  private process : ChildProcess;

  constructor(process : ChildProcess) {
    this.process = process;
  }

  public stop() : Promise<string> {
    return new Promise((resolve, reject) => {
      if(this.process === null) {
        resolve(`process is not running`);
      } else {
        this.process.kill();
        this.process = null;
        resolve(`process was killed`);
      }
    });
  }

  public pid() : number {
    return this.process.pid;
  }

  public isRunning() : boolean;
  public isRunning(callback: Function) : boolean;

  public isRunning(callback ?: Function) : boolean {
    if(callback === null) {
      return this.process !== null;
    } else {
      ps.lookup({
        pid: process.pid
      }, (err, processes) => {
          callback(processes.length > 0);
      });
    }
  }
}
