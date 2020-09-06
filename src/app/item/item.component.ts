import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { StationeryService } from '../shared/services/stationery.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit {

  @Input() id: number;
  @Input() name: string;
  @Input() cost: number;
  
  @Output() onDelete = new EventEmitter();

  constructor(private ss: StationeryService) { }

  ngOnInit() {

  }

  onEditClick() {
    this.ss.startEditing({id: this.id, name: this.name, cost: this.cost});
  }

  onDeleteClick() {
    try {
      this.ss.delete(this.ss.getStationery(this.id, this.name, this.cost));
    }
    catch(error){
      this.ss.openSnackBar(error);
    }
    this.onDelete.emit();
  }

}
