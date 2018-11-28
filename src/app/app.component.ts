import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var particlesJS: any; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'material-table';

  ngOnInit(){}

  ngAfterViewInit(){
    /* particlesJS.load('particles-js', 'assets/data/particles.json', function() { 
      console.log('callback - particles.js config loaded'); 
    }); */
  }
}
