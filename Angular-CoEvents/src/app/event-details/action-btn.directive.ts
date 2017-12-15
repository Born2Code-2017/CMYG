import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appActionBtn]'
})

export class ActionBtnDirective {
  @HostBinding('class.active') isActive = false;

  @HostListener('click')
  toggleOpen() {
    this.isActive = !this.isActive;
  }

  constructor() { }

}
