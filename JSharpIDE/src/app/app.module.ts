import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AceModule } from 'ngx-ace-wrapper';
import { ACE_CONFIG } from 'ngx-ace-wrapper';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TreeComponent } from './tree/tree.component';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {};

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    TreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AceModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: ACE_CONFIG, useValue: DEFAULT_ACE_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
