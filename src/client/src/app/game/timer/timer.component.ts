import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Team } from 'src/app/model/team.model';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit {
  @Input() time!: number;
  @Input() display: boolean = false;
  @Input() currentTeam!: Team;
  team = Team;
  constructor() {}

  ngOnInit(): void {}
}
