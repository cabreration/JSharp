import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { graphviz }  from 'd3-graphviz';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, OnChanges {

  @Input() dot: any;
  constructor() { }

  ngOnInit(): void {
    //let dot = JSON.parse(sessionStorage.getItem('compile')).dot;
  }

  ngOnChanges() {
    this.renderDot();
  }

  renderDot() {
    if (this.dot != null)
      graphviz('section').renderDot(this.dot);
  }

}
