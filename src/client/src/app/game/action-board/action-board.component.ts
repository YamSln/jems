import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Participant } from 'src/app/model/participant.model';
import { Role } from 'src/app/model/role.model';
import { Team } from 'src/app/model/team.model';

@Component({
  selector: 'app-action-board',
  templateUrl: './action-board.component.html',
  styleUrls: ['./action-board.component.scss'],
})
export class ActionBoardComponent implements OnInit {
  team = Team;
  role = Role;

  @Input() currentTeam!: Team;
  @Input() participants!: Participant[];
  @Input() turnTime!: number;
  @Input() playerTeam!: Team;
  @Input() playerRole!: Role;

  @Output() changeTeamEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeRoleEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  changePlayerTeam(): void {
    this.changeTeamEvent.emit();
  }

  changePlayerRole(): void {
    this.changeRoleEvent.emit();
  }
}
