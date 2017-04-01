import * as dgram from 'dgram';

import { Config } from '../Config';

export class RetroArchUDPCommandExecutor {

  private config : Config;

  constructor(config : Config) {
      this.config = config;
  }

  public send(command : string) : Promise<string> {
    console.log(`send command ${command}`)

    return new Promise((resolve, reject) => {
      const client = dgram.createSocket('udp4');

      client.send(command, this.config.get('retroarchUDPPort'), 'localhost', (err) => {
        if(err){
          console.error(`could not send UDP command: ${err}`);
        }
        client.close();
      });
    });
  }
}

export enum RetroArchUDPCommand {
  FAST_FORWARD,
  FAST_FORWARD_HOLD,
  LOAD_STATE,
  SAVE_STATE,
  FULLSCREEN_TOGGLE,
  QUIT,
  STATE_SLOT_PLUS,
  STATE_SLOT_MINUS,
  REWIND,
  MOVIE_RECORD_TOGGLE,
  PAUSE_TOGGLE,
  FRAMEADVANCE,
  RESET,
  SHADER_NEXT,
  SHADER_PREV,
  CHEAT_INDEX_PLUS,
  CHEAT_INDEX_MINUS,
  CHEAT_TOGGLE,
  SCREENSHOT,
  MUTE,
  NETPLAY_FLIP,
  SLOWMOTION,
  VOLUME_UP,
  VOLUME_DOWN,
  OVERLAY_NEXT,
  DISK_EJECT_TOGGLE,
  DISK_NEXT,
  DISK_PREV,
  GRAB_MOUSE_TOGGLE,
  MENU_TOGGLE
}
