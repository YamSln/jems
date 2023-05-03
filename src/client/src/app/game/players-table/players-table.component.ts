import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Team } from '../../../../../model/team.model';
import { Player } from '../../../../../model/player.model';
import { Role } from '../../../../../model/role.model';

@Component({
  selector: 'app-players-table',
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersTableComponent implements OnInit {
  @Input() players!: Player[];
  @Input() playerId!: string;

  team = Team;
  role = Role;

  constructor() {}

  ngOnInit(): void {}
}
