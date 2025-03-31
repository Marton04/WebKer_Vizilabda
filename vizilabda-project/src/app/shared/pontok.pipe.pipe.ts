import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pontokPipe'
})
export class PontokPipePipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    if (!array || !field) {
      return array;
    }
    return array.sort((a, b) => b[field] - a[field]);
  }

}
