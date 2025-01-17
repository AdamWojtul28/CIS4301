import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog'

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DatapageComponent } from './datapage/datapage.component';
import { QuizComponent } from './quiz/quiz.component';
import { ExploreComponent } from './explore/explore.component';
import { Explore1Component } from './explore1/explore1.component';
import { Explore2Component } from './explore2/explore2.component';
import { Explore3Component } from './explore3/explore3.component';
import { Explore4Component } from './explore4/explore4.component';
import { Explore5Component } from './explore5/explore5.component';
import { Explore6Component } from './explore6/explore6.component';
import { Explore7Component } from './explore7/explore7.component';
import { Explore8Component } from './explore8/explore8.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    DatapageComponent,
    QuizComponent,
    ExploreComponent,
    Explore1Component,
    Explore2Component,
    Explore3Component,
    Explore4Component,
    Explore5Component,
    Explore6Component,
    Explore7Component,
    Explore8Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    MatSlideToggleModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    MatCardModule,
    MatSliderModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
