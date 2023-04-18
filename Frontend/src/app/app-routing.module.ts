import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DatapageComponent } from './datapage/datapage.component';
import { ResultPageComponent } from './result-page/result-page.component';
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

const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'data', component: DatapageComponent },
    { path: 'result', component: ResultPageComponent },
    { path: 'quiz', component: QuizComponent },
    { path: 'explore', component: ExploreComponent },
    { path: 'explore1', component: Explore1Component },
    { path: 'explore2', component: Explore2Component },
    { path: 'explore3', component: Explore3Component },
    { path: 'explore4', component: Explore4Component },
    { path: 'explore5', component: Explore5Component },
    { path: 'explore6', component: Explore6Component },
    { path: 'explore7', component: Explore7Component },
    { path: 'explore8', component: Explore8Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
