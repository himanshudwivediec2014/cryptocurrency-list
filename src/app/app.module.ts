import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

//
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http'

//MAT-TAB
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule, MatSortModule, MatPaginatorModule, MatSnackBarModule } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';

import { ToastrModule } from 'ng6-toastr-notifications';
import { Ng5SliderModule } from 'ng5-slider';

import 'hammerjs';
import 'hammer-timejs';

import { NgHttpLoaderModule } from 'ng-http-loader';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { AppHttpService } from './app-http.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PriceChartComponent } from './price-chart/price-chart.component';
import { ComparisonChartComponent } from './comparison-chart/comparison-chart.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    PriceChartComponent,
    ComparisonChartComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgHttpLoaderModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    Ng5SliderModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      {path:'home', component: LandingPageComponent},
      {path:'list', component: ListComponent},
      {path:'price', component: PriceChartComponent},
      {path:'compare', component: ComparisonChartComponent},
      {path:'', redirectTo:'home', pathMatch:'full'},
      {path:'*', redirectTo:'home', pathMatch:'full'},
      {path:'**', redirectTo:'home', pathMatch:'full'}
    ])
  ],
  providers: [AppHttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
