import {
  Component,
  Directive,
  OnInit,
  ViewChild,
  ContentChild,
  ContentChildren,
  AfterContentInit,
  QueryList,
  Input,
  ElementRef,
  Renderer } from '@angular/core';

import { CarouselSlideComponent } from "../carousel-slide/carousel-slide.component";

@Directive({ selector: 'div' })
class CarouselContainer {}

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterContentInit {

  @ContentChildren(CarouselSlideComponent) slides : QueryList<CarouselSlideComponent>;
  @ViewChild(CarouselContainer) div : CarouselContainer;

  private offsetX : number = 0;
  private positionX : number = 0;

  constructor(private el : ElementRef, private renderer : Renderer) {}

  public ngOnInit() {}

  public ngAfterContentInit() {}

  onSwipe(event : any) : void {
    //this.slides.forEach((slide) => slide.animate(event.velocityX));
    //
    // let delta = event.velocityX * 400;
    //
    // if(event.direction === 2) { // LEFT
    //   this.positionX -= delta;
    // }
    //
    // if(event.direction === 4) { // RIGHT
    //   this.positionX += delta;
    // }
    //
    // this.el.nativeElement.children[0].scrollLeft = this.positionX;

  }

  onPan(event : any) : void {
    // console.log(event);
    // this.el.nativeElement.scrollWidth => 5000

    // this.renderer.setElementProperty(
    //   this.el.nativeElement.children[0], 'scrollLeft', Math.abs(event.deltaX));

  //  console.log(event);



    // console.log(this.el.nativeElement.children[0]);

    // switch(event.type) {
    //   case 'panleft':
    //   case 'panright':
    //     this.offsetX = this.positionX - event.deltaX;
    //     // this.slides.forEach((slide) => slide.setOffsetX(event.deltaX));
    //   break;
    //   case 'panend':
    //     this.positionX = this.positionX - event.deltaX;
    //     // this.slides.forEach((slide) => slide.setPositionX(event.deltaX));
    // }
    //
    // this.el.nativeElement.children[0].scrollLeft = this.offsetX;
  }
}
