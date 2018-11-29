import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppHttpService } from '../app-http.service';
import { Observable } from 'rxjs';

/** */
import { Chart } from 'chart.js';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.css']
})
export class PriceChartComponent implements OnInit {

  public id;
  public dataHolder;

  constructor(private _route: ActivatedRoute,
    private router: Router,
    private appHttpService: AppHttpService,
    private spinner: SpinnerVisibilityService,
    private toastr: ToastrManager) {
    spinner.show();
    spinner.hide();
  }

  ngOnInit() {
    this.getQueryParam();
  }

  public getQueryParam() {
    this._route.queryParams
      .subscribe((param: Params) => {
        if (param != undefined || param != null) {
          if (param.arg == undefined || param.arg == null) {
            this.toastr.errorToastr("Please select a coin first!", "Error!", {
              position: 'top-center',
              toastTimeout: 1000
            });
            setTimeout(() => {
              this.router.navigate(['/list']);
            }, 1000);
          } else {
            this.id = Number(param.arg);
            this.getCurrency(this.id)
          }
        } else {
          this.toastr.errorToastr("You've come wrong way!", "Oops!", {
            position: 'top-center',
            toastTimeout: 1000
          });
          setTimeout(() => {
            this.router.navigate(['/list']);
          }, 1000);
        }
      });
  }

  public getCurrency(id) {
    this.appHttpService.getCurrency(id)
      .subscribe((data) => {
        this.dataHolder = data.data;
        this.getChart(this.dataHolder);
      },
        (error) => {
          setTimeout(() => {
            this.toastr.errorToastr("Some Error Occured!", "Oops!", {
              position: 'top-right',
              toastTimeout: 1000
            });
            this.router.navigate(['/home']);
          }, 1000);
        })
  }


  /**Price Chart */
  public getChart(dataHolder) {

    let today = (new Date()).toString().split(' ').splice(1, 3).join(' ');

    let prevPrice = (dataHolder.quotes.USD.price * 100) / (100 + dataHolder.quotes.USD.percent_change_24h)
    let currPrice = dataHolder.quotes.USD.price;
    let ctx = document.getElementById('canvas');

    let priceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["24hrs ago", today],
        datasets: [{
          label: `${dataHolder.name} Price ${dataHolder.quotes.USD.percent_change_24h}%`,
          data: [prevPrice, currPrice],
          fill: true,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            "#3e95cd"
          ],
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: `${dataHolder.name}'s price variation`,
          fontSize: 25
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Time"
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Price"
            },
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }
}