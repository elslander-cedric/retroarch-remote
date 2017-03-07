import { Promise } from 'bluebird';

import { ProcessExecution } from './ProcessExecution';

export interface ProcessLauncher {

  launch(args ?: Array<string>) : Promise<ProcessExecution>;

}
