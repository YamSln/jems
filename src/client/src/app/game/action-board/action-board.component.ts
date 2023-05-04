import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Player } from '../../../../../model/player.model';
import { Role } from '../../../../../model/role.model';
import { Team } from '../../../../../model/team.model';

@Component({
  selector: 'app-action-board',
  templateUrl: './action-board.component.html',
  styleUrls: ['./action-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBoardComponent implements OnInit {
  @Input() currentTeam!: Team;
  @Input() players!: Player[];
  @Input() turnTime!: number;
  @Input() playerId!: string;
  @Input() playerTeam!: Team;
  @Input() playerRole!: Role;
  @Input() wordPacks!: string[];
  @Input() selectedWordPack!: number;

  @Output() changeTeamEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeRoleEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() endTurnEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() setTimeEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectWordPackEvent: EventEmitter<number> =
    new EventEmitter<number>();

  team = Team;
  role = Role;

  constructor() {}

  ngOnInit(): void {}

  changePlayerTeam(): void {
    this.changeTeamEvent.emit();
  }

  changePlayerRole(): void {
    this.changeRoleEvent.emit();
  }

  endTurn(): void {
    this.endTurnEvent.emit();
  }

  onSetTime(time: number): void {
    this.setTimeEvent.emit(time);
  }

  onSelectWordsPack(index: number): void {
    if (index != this.selectedWordPack) {
      this.selectWordPackEvent.emit(index);
    }
  }
}
