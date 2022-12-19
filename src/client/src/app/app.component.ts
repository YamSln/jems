import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SharedFacade } from './shared/state/shared.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'jems';
  events!: Subscription;
  lightTheme!: Subscription;

  isLightTheme!: Observable<boolean>;

  constructor(
    private router: Router,
    private sharedFacade: SharedFacade,
    private overlay: OverlayContainer
  ) {}

  ngOnInit(): void {
    this.isLightTheme = this.sharedFacade.getIsLightTheme();
    this.events = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event) {
          this.sharedFacade.hideLoading();
        }
      });
    this.lightTheme = this.isLightTheme.subscribe((isLightTheme) => {
      if (isLightTheme) {
        this.overlay.getContainerElement().classList.remove('theme-dark');
      } else {
        this.overlay.getContainerElement().classList.add('theme-dark');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.events) {
      this.events.unsubscribe();
    }
    if (this.lightTheme) {
      this.lightTheme.unsubscribe();
    }
  }
}
