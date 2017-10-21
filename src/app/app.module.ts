// import { LoadingService } from './shared/loading/loading.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

// create components&modules
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Location, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TestPageComponent } from './test-page/test-page.component';
import { LoginComponent } from './login/login.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { TopPageComponent } from './top-page/top-page.component';

// create service
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [

  ],
  declarations: [
    AppComponent,
    TestPageComponent,
    LoginComponent,
    EvaluationComponent,
    TopPageComponent
  ],
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
