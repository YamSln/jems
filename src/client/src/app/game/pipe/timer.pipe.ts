import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer',
})
export class TimerPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    if (value <= 5999) {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return (
        (minutes > 9 ? `${minutes}` : '0' + minutes) +
        ':' +
        (seconds > 9 ? `${seconds}` : '0' + seconds)
      );
    } else {
      return `${value}`;
    }
  }
}
