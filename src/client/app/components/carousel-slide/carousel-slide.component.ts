import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ElementRef,
  Renderer } from '@angular/core';

@Component({
  selector: 'carousel-slide',
  templateUrl: './carousel-slide.component.html',
  styleUrls: ['./carousel-slide.component.css']
})
export class CarouselSlideComponent implements OnInit, AfterViewInit {
  @Input() image : string;

  public offsetX : number = 0;
  private positionX : number = 0;

  constructor(private el : ElementRef, private renderer : Renderer) {}

  public ngOnInit() {}

  public ngAfterViewInit() {}

  public setOffsetX(offsetX : number) : void {
    if(this.positionX + offsetX >= 0) {
      this.offsetX = 0;
    } else {
      this.offsetX = this.positionX + offsetX;
    }
  }

  public setPositionX(offsetX : number) : void {
    console.log(this.positionX + offsetX + " vs " + this.el.nativeElement.offsetLeft);

    // this.el.nativeElement.offsetWidth => 100
    // this.el.nativeElement.offsetLeft => 4900
    // this.el.nativeElement.clientWidth => 100

    if(this.positionX + offsetX >= 0) {
      this.positionX = 0;
    } else {
      this.positionX = this.positionX + offsetX;
    }
  }

  public animate(velocityX : number) : void {
    //this.offsetX = this.positionX + (velocityX * 100);
  }
}
