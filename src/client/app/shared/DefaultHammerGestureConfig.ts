import { HammerGestureConfig } from '@angular/platform-browser';

export class DefaultHammerGestureConfig extends HammerGestureConfig  {
  overrides = <any>{
      'swipe': {
        velocity: 0.3,
        threshold: 20,
        direction: 2 + 4 // left + right
      }
  }
}
