import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  openGithub(): void {
    window.open(environment.github, '_blank');
  }

  hasGithubLink(): boolean {
    return !!environment.github;
  }
}
