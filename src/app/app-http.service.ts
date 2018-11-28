import { Injectable } from '@angular/core';

//
import {User} from './models/user.model'
//
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppHttpService {

  private tickerUrl = 'https://api.coinmarketcap.com/v2/ticker/';

  public tickerSpecificUrl = 'https://api.coinmarketcap.com/v2/ticker/';

  constructor(private _http:HttpClient) { }

  public getData():Observable<any>{
    return this._http.get(this.tickerUrl);
  }

  public getCurrency(id): Observable<any>{
    return this._http.get(`https://api.coinmarketcap.com/v2/ticker/${id}/`)
  }

  //localStorage getter
  public getFavListFromLocalStorage = ()=>{
    return JSON.parse(localStorage.getItem('favList'));
  }

  //localStorage setter
  public setFavListInLocalStorage = (data) =>{
    localStorage.setItem('favList', JSON.stringify(data));
  }
}
