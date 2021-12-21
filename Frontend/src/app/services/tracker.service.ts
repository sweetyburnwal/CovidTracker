import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  public url: string = 'http://localhost:9000/covid/states';

  constructor(private http: HttpClient) { }

  getCovidData(): Observable<any> {
    return this.http.get(this.url);
  }

  getStateList(): Observable<any> {
    return this.http.get("http://localhost:9000/states");
  }
}
