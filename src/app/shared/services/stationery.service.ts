import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { StationeryModel } from '../models/stationery.model'
import { map, catchError } from 'rxjs/operators'
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
 
@Injectable({
  providedIn: 'root'
})
export class StationeryService {

  public edit$ = new Subject<StationeryModel>();

  private uri = 'http://localhost:4000';

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  create(stationery: StationeryModel) {
    this.http.post(`${this.uri}/`, {name: stationery.name, cost: stationery.cost}).subscribe(res => console.log('Inserted'));
  }

  read() {
    return this.http.get(`${this.uri}/`);
  }

  update(stationery: StationeryModel) {
    this.http.put(`${this.uri}/${stationery.id}`, stationery).subscribe(res => console.log('Updated'));
  }
  
  delete(stationery: StationeryModel) {
    this.http.delete(`${this.uri}/${stationery.id}`).subscribe(res => console.log('Removed'));
  }

  startEditing(stationery: StationeryModel) {
    this.edit$.next(stationery);
  }

  getStationery(id: number, name: string, cost: number) {
    return {id, name, cost};
  }

  openSnackBar(message) {
    this._snackBar.open(message, '', {
      duration: 2000,
    });
  }
}
