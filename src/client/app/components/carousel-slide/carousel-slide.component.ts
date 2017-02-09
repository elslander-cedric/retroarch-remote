import { Component, OnInit, AfterViewInit, Input, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'carousel-slide',
  templateUrl: './carousel-slide.component.html',
  styleUrls: ['./carousel-slide.component.css']
})
export class CarouselSlideComponent implements OnInit, AfterViewInit {
  @Input() image : string;

  private offsetX : number = 0;
  private positionX : number = 0;

  constructor(private el : ElementRef, private renderer : Renderer) {}

  public ngOnInit() {}

  public ngAfterViewInit() {
    // this.positionX = this.el.nativeElement.style.left;
  }

  public setOffsetX(offsetX : number) : void {
    this.offsetX = this.positionX + offsetX;
  }

  public setPositionX(offsetX : number) : void {
    this.positionX = this.positionX + offsetX;
  }
}
