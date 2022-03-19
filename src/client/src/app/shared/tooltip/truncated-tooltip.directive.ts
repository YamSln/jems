import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[matTooltip][appTruncatedTooltip]',
})
export class TruncatedTooltipDirective {
  constructor(
    private matTooltip: MatTooltip,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  @HostListener('mouseenter') initTooltip() {
    const element = this.elementRef.nativeElement;
    this.matTooltip.disabled = element.scrollWidth <= element.clientWidth;
  }
}
