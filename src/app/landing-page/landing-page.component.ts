import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as  particlesJS from 'particles.js';
declare var particlesJS: any;

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    particlesJS.load('particles-js', 'assets/data/particles.json',
     function() { 
       console.log('callback - particles.js config loaded'); 
      });
  }

}
