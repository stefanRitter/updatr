import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { LinkAdderComponent } from './link-adder/link-adder.component';
import { LinksRendererComponent } from './links-renderer/links-renderer.component';
import { LinksGroupComponent } from './links-group/links-group.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    LinkAdderComponent,
    LinksRendererComponent,
    LinksGroupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
