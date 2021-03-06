import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChildren,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { Team } from 'src/app/model/team.model';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfettiComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() winningTeam: boolean = false;

  winningConfetti: any;
  confettiInterval: any;
  @ViewChildren('confetti') confettiCanvas: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.winningTeam.currentValue) {
      this.triggerConfetti();
    } else {
      this.clearConfetti();
    }
  }

  triggerConfetti(): void {
    this.winningConfetti = confetti.create(this.confettiCanvas.nativeElement, {
      resize: true,
      disableForReducedMotion: true,
    });
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    this.confettiInterval = setInterval(() => {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(this.confettiInterval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      this.winningConfetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      this.winningConfetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }

  clearConfetti(): void {
    clearInterval(this.confettiInterval);
  }
}
