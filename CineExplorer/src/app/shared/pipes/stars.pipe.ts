import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stars',
  standalone: true
})
export class StarsPipe implements PipeTransform {
  transform(value: number, maxStars: number = 5): string {
    if (value === null || value === undefined) return '☆'.repeat(maxStars);

    const filledStars = Math.round((value / 10) * maxStars);
    const filled = '★'.repeat(filledStars);
    const empty = '☆'.repeat(maxStars - filledStars);
    return filled + empty;
  }
}