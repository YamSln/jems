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
import { Team } from '../../../../../model/team.model';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfettiComponent implements OnChanges, OnDestroy {
  @Input() winningTeam?: Team;

  sapphireConfetti: any;
  rubyConfetti: any;
  confettiInterval: any;
  @ViewChildren('confetti') confettiCanvas: any;

  constructor() {}

  ngOnInit(): void {
    this.sapphireConfetti = new JSConfetti({
      canvas: this.confettiCanvas,
    });
    this.rubyConfetti = new JSConfetti({
      canvas: this.confettiCanvas,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.winningTeam.currentValue) {
      // Trigger confetti for winning team
      this.triggerConfetti(changes.winningTeam.currentValue);
    } else {
      this.clearConfetti();
    }
  }

  triggerConfetti(team: Team): void {
    // 5 times confetti interval
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
        this.sapphireConfetti.addConfetti({
          confettiColors: ['#43a6c6'],
          confettiNumber: 50,
        });
        break;
      case Team.RUBY:
        this.rubyConfetti.addConfetti({
          confettiColors: ['#e94444'],
          confettiNumber: 50,
        });
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
