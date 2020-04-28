import { Component, OnInit } from '@angular/core';
import { graphviz }  from 'd3-graphviz';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let dot = JSON.parse(sessionStorage.getItem('compile')).dot;
    if (dot != null)
      graphviz('main').renderDot(dot);
  }

}
