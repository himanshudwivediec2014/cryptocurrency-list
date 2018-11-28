import { Component, OnInit } from '@angular/core';

//
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppHttpService } from '../app-http.service';
import { Observable } from 'rxjs';
/** */
import { Chart } from 'chart.js';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-comparison-chart',
  templateUrl: './comparison-chart.component.html',
  styleUrls: ['./comparison-chart.component.css']
})
export class ComparisonChartComponent implements OnInit {

  public idHolder1: any;
  public idHolder2: any;
  public dataArray: any = [];

  constructor(private _route: ActivatedRoute,
    private router: Router,
    private appHttpService: AppHttpService,
    private spinner: SpinnerVisibilityService,
    private toastr: ToastrManager) {
    spinner.show();
    spinner.hide();
  }

  ngOnInit() {
    this.getQueryParams();
  }

  public getQueryParams() {
    this._route.queryParams
      .subscribe((params: Params) => {
        if (params != undefined || params != null) {
          if (params.arg1 == undefined || params.arg2 == undefined || (params.arg1 == undefined && params.arg2 == undefined)) {
            this.toastr.errorToastr("Select some coins first!", "Oops!", {
              position: 'top-center',
              toastTimeout: 1000
            });
            setTimeout(()=>{
              this.router.navigate(['/list']);
            }, 1000);
          } else {
            console.log(params);
            this.idHolder1 = params.arg1;
            this.idHolder2 = params.arg2;

            this.getData(this.idHolder1);
            this.getData(this.idHolder2);
            console.log(this.idHolder1 + "," + this.idHolder2);
          }
        } else {
          this.toastr.errorToastr("You've come wrong way!", "Oops!", {
            position: 'top-center',
            toastTimeout: 1000
          });
          setTimeout(()=>{
            this.router.navigate(['/list']);
          }, 1000);
          
        }
      });
  }

  public getData(id){
    this.appHttpService.getCurrency(id)
      .subscribe((data)=>{
        this.dataArray.push(data.data)
        console.log(this.dataArray);

        if(this.dataArray.length === 2){
          this.getChart(this.dataArray)
        }
      })
  }


  public getChart(dataArray){
    let today = (new Date()).toString().split(' ').splice(1,3).join(' ');
    
    let prevPriceFirst = (dataArray[0].quotes.USD.price * 100) / (100 + dataArray[0].quotes.USD.percent_change_24h)
    let currPriceFirst = dataArray[0].quotes.USD.price;

    let prevPriceSecond = (dataArray[1].quotes.USD.price * 100) / (100 + dataArray[1].quotes.USD.percent_change_24h)
    let currPriceSecond = dataArray[1].quotes.USD.price;
    
    console.log(prevPriceFirst);
    console.log(currPriceFirst);
    console.log(prevPriceSecond);
    console.log(currPriceSecond);

    let ctx = document.getElementById('canvas');
    
     let priceChart = new Chart(ctx, {
       type: 'pie',
       data:{
         labels: [`${dataArray[0].name} 24hrs ago`, `${dataArray[0].name} on ${today}`, 
                  `${dataArray[1].name} 24hrs ago`, `${dataArray[1].name} on ${today}`],
         datasets: [{
           label: "Price",
           data: [prevPriceFirst, currPriceFirst, prevPriceSecond, currPriceSecond],
           fill: true,
           backgroundColor: [						
            "#8e5ea2",
            "#3cba9f",
            "#e8c3b9",
            "#c45850"
					],
          borderWidth: 1,
          borderColor: '#777',
          hoverBorderWidth: 2,
          hoverBorderColor: '#fff'
         }]
       },
       options: {
         responsive: true,
         maintainAspectRatio: false,
         title: {
          display: true,
          text: `${dataArray[0].name} and ${dataArray[1].name} Price Comparison`,
          fontSize: 25
         }
       }
     });
  }
}


