import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { StationeryService } from '../shared/services/stationery.service'
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const names = ['Карандаш', 'Бумага', 'Ластик', 'Степлер'];

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && !control.pristine && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-knobs',
  templateUrl: './knobs.component.html',
  styleUrls: ['./knobs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnobsComponent implements OnInit, OnDestroy {

  @Output() onCreateOrUpdate = new EventEmitter();

  public nameControl: FormControl;
  public costControl: FormControl;
  public placeholderName = this.getRandomName();
  public placeholderCost = this.getRandomCost();
  public matcher = new MyErrorStateMatcher();
  public isEditing = false;

  private ngUnsubscribe = new Subject<never>();
  private editingId: number | undefined = undefined

  constructor(private cd: ChangeDetectorRef, private ss: StationeryService) {
    this.resetForms();
  }

  ngOnInit() {
    this.ss.edit$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((x) => {
      this.nameControl.setValue(x.name);
      this.costControl.setValue(x.cost);
      this.editingId = x.id;
      this.isEditing = true;
      this.nameControl.updateValueAndValidity();
      this.costControl.updateValueAndValidity();
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public createOrUpdate() {
    const s = this.ss.getStationery(this.editingId, this.nameControl.value, this.costControl.value)
    if (this.isEditing) {
      try {
        this.ss.update(s);
      }
      catch(error) {
        this.ss.openSnackBar(error);
      }
      this.isEditing = false;
    }
    else {
      try{
        this.ss.create(s);
      }
      catch(error){
        this.ss.openSnackBar(error);
      }
    }
    this.onCreateOrUpdate.emit();
    this.resetForms();
  }

  public cancelEdit() {
    this.isEditing = false;
    this.resetForms();
  }

  public getRandomName(): string {
    return names[Math.floor(Math.random() * names.length)]
  }

  public getRandomCost(): number {
    return (Math.floor(Math.random() * 20) + 1) * 5 + Math.floor(Math.random() * 20) / 20 ;
  }

  public isButtonActive(): boolean {
    return this.nameControl.valid && this.costControl.valid 
      && this.nameControl.value != null && this.costControl.value != null
  }

  private resetForms() {
    this.nameControl = new FormControl('', [
      Validators.required
    ]);
    this.costControl = new FormControl('', [
      Validators.pattern(new RegExp('^\\d+(\\.|\\,)?(\\d{1,2})?$')),
      Validators.required
    ]);
    this.nameControl.markAsPristine();
    this.costControl.markAsPristine();
  }
}
