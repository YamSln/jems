import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['./time-selector.component.scss'],
})
export class TimeSelectorComponent implements OnInit {
  @Input() turnTime!: number;

  @Output() setTimeEvent: EventEmitter<number> = new EventEmitter<number>();

  private readonly TIME_INPUTS: number[] = [0, 60, 90, 120];

  constructor() {}

  ngOnInit(): void {}

  setTime($event: any): void {
    this.setTimeEvent.emit(this.TIME_INPUTS[$event.value]);
  }

  getTime(): number {
    return this.TIME_INPUTS.findIndex((time) => time === this.turnTime);
  }
}
