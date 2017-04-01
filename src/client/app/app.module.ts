import './rxjs-extensions';

import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, RequestOptions } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import {} from 'hammer.js';
import { Md2Module } from 'md2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { GameSearchComponent } from './components/game-search/game-search.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CarouselSlideComponent } from './components/carousel-slide/carousel-slide.component';
import { GameService, DefaultRequestOptions } from "./services/game.service";
import { WebSocketService  } from "./services/websocket.service";
import { DefaultHammerGestureConfig } from "./shared/DefaultHammerGestureConfig";
import { GameOverviewModalComponent } from './components/game-overview-modal/game-overview-modal.component';
import { AvailableComponent } from './components/available/available.component';
import { GameFilterPipe } from './pipes/game-filter/game-filter.pipe';
import { GameSortPipe } from './pipes/game-sort/game-sort.pipe';
import { RemoteComponent } from './components/remote/remote.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GameSearchComponent,
    SuggestionsComponent,
    ConfirmModalComponent,
    CarouselComponent,
    CarouselSlideComponent,
    GameOverviewModalComponent,
    AvailableComponent,
    GameFilterPipe,
    GameSortPipe,
    RemoteComponent
  ],
  entryComponents: [
    ConfirmModalComponent,
    GameOverviewModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    MaterialModule.forRoot(),
    FlexLayoutModule,
    Md2Module.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [
    GameService,
    WebSocketService,
    {
      provide: RequestOptions,
      useClass: DefaultRequestOptions
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: DefaultHammerGestureConfig
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
