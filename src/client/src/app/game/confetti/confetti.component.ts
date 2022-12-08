import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChildren,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import JSConfetti from 'js-confetti';
import { Team } from 'src/app/model/team.model';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfettiComponent implements OnChanges, OnDestroy {
  @Input() winningTeam?: Team;

  blueConfetti: any;
  redConfetti: any;
  confettiInterval: any;
  @ViewChildren('confetti') confettiCanvas: any;

  constructor() {}

  ngOnInit(): void {
    this.blueConfetti = new JSConfetti({
      canvas: this.confettiCanvas,
    });
    this.redConfetti = new JSConfetti({
      canvas: this.confettiCanvas,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.winningTeam.currentValue) {
      this.triggerConfetti(changes.winningTeam.currentValue);
    } else {
      this.clearConfetti();
    }
  }

  triggerConfetti(team: Team): void {
    this.throwConfetti(team);
    let i = 1;
    this.confettiInterval = setInterval(() => {
      this.throwConfetti(team);
      i++;
      if (i > 4) {
        this.clearConfetti();
      }
    }, 1000);
  }

  throwConfetti(team: Team): void {
    switch (team) {
      case Team.SAPPHIRE:
        this.blueConfetti.addConfetti({ confettiColors: ['#43a6c6'] });
        break;
      case Team.RUBY:
        this.redConfetti.addConfetti({ confettiColors: ['#e94444'] });
        break;
    }
  }

  ngOnDestroy(): void {
    this.clearConfetti();
  }

  clearConfetti(): void {
    clearInterval(this.confettiInterval);
  }
}
