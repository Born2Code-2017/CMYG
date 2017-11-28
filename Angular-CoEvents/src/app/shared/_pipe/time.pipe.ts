import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const time = value.split(':', 3);
    return time[0] + ':' + time[1];
  }

}
