import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appCategory]'
})

export class CategoryDirective {
  @HostBinding('class.opened') isActive = false;

  @HostListener('click')
  toggleOpen() {
    this.isActive = !this.isActive;
  }

  constructor() { }

}
