import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'anyArray',
  standalone: true
})
export class AnyArrayPipe implements PipeTransform {
  transform(value: any): any[] {
    return Array.isArray(value) ? value : [];
  }
}
