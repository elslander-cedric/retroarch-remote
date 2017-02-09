import {
  Component,
  OnInit,
  ContentChildren,
  AfterContentInit,
  QueryList } from '@angular/core';

import { CarouselSlideComponent } from "../carousel-slide/carousel-slide.component";

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterContentInit {

  @ContentChildren(CarouselSlideComponent) slides : QueryList<CarouselSlideComponent>;

  constructor() {}

  public ngOnInit() {}

  public ngAfterContentInit() {}

  onSwipe(event : any) : void {
    // TODO-FIXME
  }

  onPan(event : any) : void {
    switch(event.type) {
      case 'panleft':
      case 'panright':
        this.slides.forEach((slide) => slide.setOffsetX(event.deltaX));
      break;
      case 'panend':
        this.slides.forEach((slide) => slide.setPositionX(event.deltaX));
    }
  }
}
