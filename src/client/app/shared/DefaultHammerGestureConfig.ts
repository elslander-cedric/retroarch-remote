import { HammerGestureConfig } from '@angular/platform-browser';

export class DefaultHammerGestureConfig extends HammerGestureConfig  {
  overrides = <any>{
      'swipe': { velocity: 0.4, threshold: 20 }
  }
}
