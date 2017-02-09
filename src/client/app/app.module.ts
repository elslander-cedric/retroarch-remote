import './rxjs-extensions';

import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, RequestOptions } from '@angular/http';
import { MaterialModule } from '@angular/material';
//import { Location, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { FlexLayoutModule } from '@angular/flex-layout';

import {} from 'hammer.js';
import { Md2Module } from 'md2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { GameSearchComponent } from './components/game-search/game-search.component';
import { TopRatedComponent } from './components/top-rated/top-rated.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CarouselSlideComponent } from './components/carousel-slide/carousel-slide.component';
import { GameService, DefaultRequestOptions } from "./shared/game/game.service";
import { DefaultHammerGestureConfig } from "./shared/DefaultHammerGestureConfig";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GameSearchComponent,
    TopRatedComponent,
    SuggestionsComponent,
    ConfirmModalComponent,
    CarouselComponent,
    CarouselSlideComponent
  ],
  entryComponents: [
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot(),
    Md2Module.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [GameService, {
    provide: RequestOptions,
    useClass: DefaultRequestOptions
  }, {
    provide: HAMMER_GESTURE_CONFIG,
    useClass: DefaultHammerGestureConfig
  } /*, Location, {provide: LocationStrategy, useClass: PathLocationStrategy}*/],
  bootstrap: [AppComponent]
})

export class AppModule {}
