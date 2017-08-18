import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { LinkAdderComponent } from './link-adder/link-adder.component';
import { LinksRendererComponent } from './links-renderer/links-renderer.component';
import { LinkRendererComponent } from './link-renderer/link-renderer.component';

import { STORE } from './updatr-store/updatr-store';


@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    LinkAdderComponent,
    LinksRendererComponent,
    LinkRendererComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [STORE],
  bootstrap: [AppComponent]
})
export class AppModule { }
