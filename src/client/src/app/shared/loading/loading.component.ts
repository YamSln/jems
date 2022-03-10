import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedFacade } from '../state/shared.facade';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  displayLoading!: Observable<boolean>;
  constructor(private facade: SharedFacade) {}

  ngOnInit(): void {
    this.displayLoading = this.facade.getLoading();
  }
}
