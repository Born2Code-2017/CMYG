import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appMenu]'
})

export class MenuDirective {
  @HostBinding('class.active') isActive = false;

  @HostListener('click') toggleOpen() {
    this.isActive = !this.isActive;
  }

  constructor() { }

}
