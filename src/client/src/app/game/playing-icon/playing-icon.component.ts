import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Team } from '../../../../../model/team.model';
import { flipAnimation } from 'angular-animations';

@Component({
  selector: 'app-playing-icon',
  templateUrl: './playing-icon.component.html',
  styleUrls: ['./playing-icon.component.scss'],
  animations: [flipAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayingIconComponent implements OnInit {
  @Input() currentTeam!: Team;

  team = Team;

  constructor() {}

  ngOnInit(): void {}
}
