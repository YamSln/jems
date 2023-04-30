import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  flipAnimation,
  flipInYOnEnterAnimation,
  flipOutYOnLeaveAnimation,
} from 'angular-animations';
import { Player } from '../../../../../model/player.model';
import { Role } from '../../../../../model/role.model';
import { Team } from '../../../../../model/team.model';

@Component({
  selector: 'app-action-board',
  templateUrl: './action-board.component.html',
  styleUrls: ['./action-board.component.scss'],
  animations: [
    flipAnimation(),
    flipInYOnEnterAnimation(),
    flipOutYOnLeaveAnimation(),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBoardComponent implements OnInit {
  team = Team;
  role = Role;
  timeInputs: number[] = [0, 60, 90, 120];

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

  constructor() {}

  ngOnInit(): void {}

  changePlayerTeam(): void {
    this.changeTeamEvent.emit();
  }

  changePlayerRole(): void {
    this.changeRoleEvent.emit();
  }

  setTime(event: any): void {
    this.setTimeEvent.emit(this.timeInputs[event.value]);
  }

  endTurn(): void {
    this.endTurnEvent.emit();
  }

  getTime(): number {
    return this.timeInputs.findIndex((time) => time === this.turnTime);
  }

  selectWordsPack(index: number): void {
    if (index != this.selectedWordPack) {
      this.selectWordPackEvent.emit(index);
    }
  }
}
