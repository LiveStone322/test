import { Component, OnInit, OnDestroy } from '@angular/core';
import { StationeryService } from './shared/services/stationery.service';
import { StationeryModel } from './shared/models/stationery.model';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  items: Observable<StationeryModel[]>;

  constructor(private ss: StationeryService) { }
  
  ngOnInit() {
    this.updateList();
  }

  ngOnDestroy() {

  }

  updateList() {
    try {
      setTimeout(() => this.items = this.ss.read().pipe(map((x: {obj: StationeryModel[]}) => <StationeryModel[]>(x.obj))), 10);
    }
    catch(error) {
      this.ss.openSnackBar(error);
    }
  }

  trackByFn(index: number, el: StationeryModel) {
    return el.id;
  }
}
