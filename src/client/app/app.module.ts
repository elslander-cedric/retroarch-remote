import './rxjs-extensions';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
//import { Location, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { FlexLayoutModule } from '@angular/flex-layout';

import {} from 'hammer.js';
import { Md2Module } from 'md2';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { GameService } from "./shared/game/game.service";

import { GameSearchComponent } from './components/game-search/game-search.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GameSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot(),
    Md2Module.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [GameService /*, Location, {provide: LocationStrategy, useClass: PathLocationStrategy}*/],
  bootstrap: [AppComponent]
})

export class AppModule {}
