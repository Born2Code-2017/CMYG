import { trigger, state, animate, style, transition } from '@angular/animations';

export const slideToTop = trigger('slideToTop', [
  state('*', style({position: 'fixed', width: '100%', height: '100%'})),
  state('*', style({position: 'fixed', width: '100%', height: '100%'})),
  transition(':enter', [
    style({transform: 'translateY(100%)'}),
    animate('.8s ease-in-out', style({transform: 'translateY(0%)'}))
  ]),
  transition(':leave', [
    style({transform: 'translateY(0%)'}),
    animate('.8s ease-in-out', style({transform: 'translateY(-100%)'}))
  ])
]);


export const slideToRight = trigger('slideToRight', [
  state('*', style({position: 'fixed', width: '250px', height: '100%'})),
  state('*', style({position: 'fixed', width: '250px', height: '100%'})),
  transition(':enter', [
    style({transform: 'translateX(-100%)'}),
    animate('.8s ease-in', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [
    style({transform: 'translateX(0%)'}),
    animate('.8s ease-out', style({transform: 'translateX(-100%)'}))
  ])
]);
