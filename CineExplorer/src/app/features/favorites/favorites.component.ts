import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { Movie } from '../../core/models';
import { MovieCardComponent } from '../../shared/components';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  protected favoritesService = inject(FavoritesService);

  favorites: Movie[] = [];
  movieToDelete: Movie | null = null;
  showModal = false;

  ngOnInit(): void {
    this.favoritesService.favorites$.subscribe(favs => {
      this.favorites = favs;
    });
  }

  isFavorite(movieId: number): boolean {
    return this.favoritesService.isFavorite(movieId);
  }

  onToggleFavorite(movie: Movie): void {
    this.movieToDelete = movie;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (this.movieToDelete) {
      this.favoritesService.removeFavorite(this.movieToDelete.id);
    }
    this.closeModal();
  }

  closeModal(): void {
    this.showModal = false;
    this.movieToDelete = null;
  }
}