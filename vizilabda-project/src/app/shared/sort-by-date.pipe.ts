import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByDate'
})
export class SortByDatePipe implements PipeTransform {
  transform(matches: any[]): any[] {
    return matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}
