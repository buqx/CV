import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/movie';
import { TmdbImagePipe, TruncatePipe, StarsPipe } from '../../pipes';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TmdbImagePipe, TruncatePipe, StarsPipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() isFavorite = false;
  @Output() toggleFavorite = new EventEmitter<Movie>();

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavorite.emit(this.movie);
  }
}