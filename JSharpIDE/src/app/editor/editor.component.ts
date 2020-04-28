import { Component, OnInit, ViewChild } from '@angular/core';
import 'brace';
import 'brace/theme/dracula';
import 'brace/mode/csharp';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers : new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const httpAddress = 'http://localhost:3000/';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @ViewChild('tabSet') tabRef: any;
  tabs = [];
  currentTab = "";
  previousTab = "";
  tabsCounter = 1;
  firstTabText = "";
  firstTabTitle = "new file";

  alert = '';
  success = '';

  @ViewChild('browse', {static: false}) browseRef: any;

  public config: AceConfigInterface = {
    mode: 'csharp',
    theme: 'dracula',
    readOnly : false,
    tabSize: 2
  };
  currentText = '';

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  CreateNewTab(text: string, name: string): void {
    this.tabs.push( { name: name, text: text, id: "ngb-tab-" + this.tabsCounter} );
    this.tabsCounter++;
  }

  ChangeCurrent(evt: any): void {
    this.previousTab = evt.activeId;
    if (this.previousTab === "firstTab") {
      this.firstTabText = this.currentText;
    }
    else {
      this.tabs.forEach((item) => {
        if (item.id === this.previousTab) {
          item.text = this.currentText;
        }
      });
    }

    this.currentTab = evt.nextId; 
    if (this.currentTab === "firstTab") {
      this.currentText= this.firstTabText;
    }
    else {
      this.tabs.forEach((item) => {
        if (item.id === this.currentTab) {
          this.currentText = item.text;
        }
      });
    }
  }

  BrowseFile(): void {
    this.browseRef.nativeElement.click();
  }

  FileUpload(event): void {
    const reader = new FileReader();
    reader.readAsText(event.srcElement.files[0]);
    let name = event.srcElement.files[0].name;
    reader.onload = (evt) => {
      console.log(evt);
      this.CreateNewTab(reader.result.toString(), name);
      event = { activeId: this.currentTab, nextId: 'ngb-tab-'+ this.tabsCounter } 
      this.ChangeCurrent(event);
    }
  }

  DeleteTab(): void {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].id === this.currentTab) {      
        this.tabs.splice(i, 1);
        break;
      }
    }

    if (this.currentTab === "firstTab") {
      this.firstTabText = "";
      this.firstTabTitle = "New File"
      this.currentText = "";
      return;
    }
    this.tabRef.select("firstTab");
    this.currentText = this.firstTabText;
  }

  async Compile() {
    let result = await this.httpClient.post(httpAddress + 'compile', { input: this.currentText }).toPromise();
    if (result['state'] === true) {
      sessionStorage.setItem('compile', JSON.stringify({dot: result['dot']}));
      this.success = 'La compilacion fue realizada exitosamente';
      setTimeout(() => this.success = '', 2000);
    } 
    else {
      this.alert = 'Algo salio mal';
      setTimeout(() => this.alert = '', 2000);
    }
  }

}
