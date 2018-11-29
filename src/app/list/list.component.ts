import { Component, OnInit, ViewChild } from '@angular/core';

//
import { AppHttpService } from '../app-http.service';
import { Observable } from 'rxjs';


import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';

import { ToastrManager } from 'ng6-toastr-notifications';

import { SelectionModel } from '@angular/cdk/collections';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs/operators';


import { User } from '../models/user.model'
import { Options, LabelType, ChangeContext } from 'ng5-slider';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public shouldEnter: boolean = false;

  public dataSource;
  public displayedColumns = ['name', 'symbol', 'price', 'market_cap', 'favourites', 'priceChart'];
  public displayedFavColumns = ['name', 'symbol', 'price', 'market_cap', 'remove', 'priceChart']
  public favColumns: boolean = false;
  public favDataSource: any;
  public dataArray = [];
  public selection;
  public visible = false;
  public asc: boolean = true;
  public sorted: boolean = false//for sorted or not
  public holderArray: number[] = [];
  public dataSourceArray: any = [];
  public ascMkt: boolean = true;
  public sortedMkt: boolean = false//for sorted or not
  /** */
  public favList: any;
  public checkFav = false;
  public checked: any = [];
  public ifDisabled = true;

  constructor(private appHttpService: AppHttpService,
    private spinner: SpinnerVisibilityService,
    public snackBar: MatSnackBar,
    private toastr: ToastrManager,
    private _route: ActivatedRoute,
    private router: Router) {
    spinner.show();
    spinner.hide();
  }

  ngOnInit() {
    this.getAllCurrencies();
    this.getFavView();
  }

  /**Method for default Favourites View */
  public getFavView() {
    this.favList = this.appHttpService.getFavListFromLocalStorage();

    if (this.favList != null) {
      if (this.favList.length != 0) {
        this.favDataSource = new MatTableDataSource(this.favList);

        this.checkFav = true;

        this.dataSource = new MatTableDataSource(this.dataArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.selection = new SelectionModel(true, []);
      } else if (this.favList.length === 0) {
        this.favList = null;
        this.appHttpService.setFavListInLocalStorage(this.favList);

        this.checkFav = false;
        this.dataSource = new MatTableDataSource(this.dataArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.selection = new SelectionModel(true, []);
      }
    } else {
      this.checkFav = false;
      this.dataSource = new MatTableDataSource(this.dataArray);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.selection = new SelectionModel(true, []);
    }
  }

  /** HTTP Service call to get all currencies */
  public getAllCurrencies: any = () => {
    this.appHttpService.getData()
      .subscribe(
        data => {
          this.shouldEnter = true;
          for (let x in data.data) {
            this.dataArray.push(data.data[x]);
          }
          this.dataSource = new MatTableDataSource(this.dataArray);
          this.assignTableStructure();
        },
        error => {
          console.log(error);
          setTimeout(()=>{
            this.toastr.errorToastr("Some Error Occured!", "Oops!",{
              position: 'top-right',
              toastTimeout: 1000
            });
            this.router.navigate(['/home']);
          }, 1000);
        })
  }

  /* Assigning dataSource, mat-sort, mat-paginator, selection */
  public assignTableStructure() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.selection = new SelectionModel(true, []);
  }

  // onPress Event
  onPress(event) {
    this.displayCheckColumn();
  }

  public displayCheckColumn() {
    if (this.displayedColumns.length <= 6 && this.visible === false) {
      this.displayedColumns.unshift("select");
      this.visible = true;
    } else if (this.displayedColumns.length > 6 && this.visible === true) {
      this.displayedColumns.shift();
      this.visible = false;
    }
  }
  // onPress event ends


  // Sort Methods for Price Column
  public sortPrice() {
    this.sortAscending();
  }

  public getAllPrices() {
    this.holderArray = [];
    for (let x in this.dataArray) {
      this.holderArray.push(this.dataArray[x].quotes.USD.price);
    }
    return this.holderArray;
  }

  public sortAscending() {
    if (!this.sorted) {

      this.getAllPrices();
      this.holderArray.sort((a, b) => {
        return a - b
      })
      this.sorted = true;
      this.assignDataSource();

    } else if (this.sorted && this.asc) {

      this.getAllPrices();
      this.holderArray.sort((a, b) => {
        return b - a;
      })
      this.asc = false;
      this.assignDataSource();

    } else if (this.sorted && !this.asc) {

      this.getAllPrices();
      this.asc = true;
      this.sorted = false;
      this.assignDataSource();
    }
  }

  public assignDataSource() {
    this.dataSourceArray = [];
    for (let x in this.holderArray) {
      for (let obj in this.dataArray) {
        if (this.holderArray[x] === this.dataArray[obj].quotes.USD.price) {
          this.dataSourceArray.push(this.dataArray[obj]);
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.dataSourceArray);
    this.assignTableStructure();
  }
  // Price sorting ends


  // Market_Cap Sorting Methods
  public sortMarketCap() {
    this.sortMarketCapAscending();
  }

  public sortMarketCapAscending() {
    if (!this.sortedMkt) {

      this.getAllMarketCap();
      this.holderArray.sort((a, b) => {
        return a - b
      })
      this.sortedMkt = true;
      this.assignMktDataSource();

    } else if (this.sortedMkt && this.ascMkt) {

      this.getAllMarketCap();
      this.holderArray.sort((a, b) => {
        return b - a;
      })
      this.ascMkt = false;
      this.assignMktDataSource();

    } else if (this.sortedMkt && !this.ascMkt) {

      this.getAllMarketCap();
      this.ascMkt = true;
      this.sortedMkt = false;
      this.assignMktDataSource();
    }
  }

  public getAllMarketCap() {
    this.holderArray = [];
    for (let x in this.dataArray) {
      this.holderArray.push(this.dataArray[x].quotes.USD.market_cap);
    }
    return this.holderArray;
  }

  public assignMktDataSource() {
    this.dataSourceArray = [];
    for (let x in this.holderArray) {
      for (let obj in this.dataArray) {
        if (this.holderArray[x] === this.dataArray[obj].quotes.USD.market_cap) {
          this.dataSourceArray.push(this.dataArray[obj]);
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.dataSourceArray);
    this.assignTableStructure();
  }


  // Price slider initialization
  minPriceValue: number = 0;
  maxPriceValue: number = 5000;
  optionsPrice: Options = {
    floor: 0,
    ceil: 6000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> $' + value;
        case LabelType.High:
          return '<b>Max price:</b> $' + value;
        default:
          return '$' + value;
      }
    }
  };

  /**/ public sliderArray: any = [];

  onUserChangePrice(changeContext: ChangeContext): void {
    this.sliderArray = [];

    for (let x in this.dataArray) {
      if (this.dataArray[x].quotes.USD.price >= changeContext.value && this.dataArray[x].quotes.USD.price <= changeContext.highValue) {
        this.sliderArray.push(this.dataArray[x]);
      }
    }
    this.dataSource = new MatTableDataSource(this.sliderArray);
    this.assignTableStructure();
  }
  // Price slider ends


  //Market_cap slider
  minMktCapValue: number = 11111111;
  maxMktCapValue: number = 99999999999;
  optionsMktCap: Options = {
    floor: 10000000,
    ceil: 99999999999,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min Cap:</b> ' + value;
        case LabelType.High:
          return '<b>Max Cap:</b> ' + value;
        default:
          return '$' + value;
      }
    }
  };

  onUserChangeMktCap(changeContext: ChangeContext) {
    this.sliderArray = [];
    for (let x in this.dataArray) {
      if (this.dataArray[x].quotes.USD.market_cap >= changeContext.value && this.dataArray[x].quotes.USD.market_cap <= changeContext.highValue) {
        this.sliderArray.push(this.dataArray[x]);
      }
    }
    this.dataSource = new MatTableDataSource(this.sliderArray);
    this.assignTableStructure();
  }
  // Market_Cap Slider ends


  // onChecked for Comparison Graph View  
  public selectedCurrency(event, row) {
    if ((this.checked.length === 0) && event.checked) {
      this.checked.push(row);
    } else if ((this.checked.length >= 1) && !event.checked) {
      for (let x in this.checked) {
        if (this.checked[x].id === row.id) {
          let i = this.checked.indexOf(row);
          if (i > -1) {
            this.checked.splice(i, 1);
          }
        }
      }
      this.checkIfDisabled(this.checked);
    } else if ((this.checked.length > 0) && event.checked) {
      this.checked.push(row);

      if (this.checked.length > 2) {
        let msg = "For Comparison, Please select only two currencies";
        this.openSnackBar(msg);
      }

      this.checkIfDisabled(this.checked);
    }
  }

  public checkIfDisabled(arr) {
    if (arr.length === 2) {
      this.ifDisabled = false;
    } else {
      this.ifDisabled = true;
    }
  }

  public openSnackBar: any = (message) => {
    this.snackBar.open(message, "Close", {
      duration: 4000,
    });
  }
  // onChecked methods end


  /**Method for Adding to Favourites*/
  public addToFavourites(currency) {
    let check = [];
    if (this.appHttpService.getFavListFromLocalStorage() != null) {
      check = this.appHttpService.getFavListFromLocalStorage();

      let index = check.findIndex(elem => elem.name === currency.name)
      if (index === -1) {
        check.push(currency);
        this.appHttpService.setFavListInLocalStorage(check);
        this.toastr.successToastr(`${currency.name} added to favourites!`, "Success!", {
          position: 'top-center',
          toastTimeout: 1000
        });
      } else if (index >= 0) {
        this.toastr.warningToastr(`${currency.name} is already in the favourites!`, "Wait!", {
          position: 'top-center',
          toastTimeout: 1000
        });
      }
    } else {
      check.push(currency);
      this.appHttpService.setFavListInLocalStorage(check);
      this.toastr.successToastr(`${currency.name} added to favourites!`, "Success!", {
        position: 'top-center',
        toastTimeout: 1000
      });
    }
  }

  /**Method to remove from favourites */
  public removeFromFavourites(currency) {
    let check = this.appHttpService.getFavListFromLocalStorage();

    let index = check.findIndex(elem => elem.id === currency.id);
    if (index > -1) {
      check.splice(index, 1);
    }
    this.toastr.errorToastr(`${currency.name} is removed from favourites`, "", {
      position: 'top-center',
      toastTimeout: 1000
    });

    this.ifCheckNull(check);
  }

  /**Check if the "check" array is empty or not, and make it null if it has become empty */
  public ifCheckNull(arr) {
    if (arr.length === 0) {
      arr = null;
      this.appHttpService.setFavListInLocalStorage(arr);
    } else {
      this.appHttpService.setFavListInLocalStorage(arr);
    }
  }

  /**Price Chart View Route */
  public goToChartView(id) {
    this.router.navigate(['/price'], { queryParams: { arg: id } });
  }

  /**Comparison Chart View Route*/
  public goToCompView() {
    this.router.navigate(['/compare'], { queryParams: { arg1: this.checked[0].id, arg2: this.checked[1].id } });
  }
}
