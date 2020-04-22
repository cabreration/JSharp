import { Component, ViewChild } from '@angular/core';
import 'brace';
import 'brace/theme/dracula';
import 'brace/mode/csharp';
import { AceConfigInterface } from 'ngx-ace-wrapper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'JSharpIDE';
}
