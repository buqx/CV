import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'tmdbImage',
  standalone: true
})
export class TmdbImagePipe implements PipeTransform {
  private readonly baseUrl = environment.tmdbImageBaseUrl;

  transform(path: string | null, size: string = 'w500'): string {
    if (!path) return '';
    return `${this.baseUrl}/${size}${path}`;
  }
}