import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { headShakeAnimation } from 'angular-animations';
import { Team } from '../../../../../model/team.model';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [headShakeAnimation()],
})
export class TimerComponent implements OnInit, OnChanges {
  @Input() time!: number;
  @Input() display: boolean = false;
  @Input() currentTeam!: Team;
  team = Team;
  constructor() {}
  warningState = false;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.time <= 10) {
      this.warningState = !this.warningState;
    }
  }
}
