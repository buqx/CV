import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Movie, Genre } from '../../core/models';
import { MovieCardComponent } from '../../shared/components';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-genre-filter',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './genre-filter.component.html',
  styleUrl: './genre-filter.component.scss'
})
export class GenreFilterComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tmdbService = inject(TmdbService);
  private favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  genres: Genre[] = [];
  movies: Movie[] = [];
  selectedGenre: Genre | null = null;
  totalResults = 0;
  totalPages = 0;
  currentPage = 1;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    this.tmdbService.getGenres().pipe(
      catchError(err => {
        console.error('Error loading genres:', err);
        return of({ genres: [] });
      })
    ).subscribe(response => {
      this.genres = response.genres;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        const genreId = +id;
        this.selectedGenre = this.genres.find(g => g.id === genreId) || null;
        if (this.selectedGenre) {
          this.loadMoviesByGenre(genreId, 1);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      } else {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMoviesByGenre(genreId: number, page: number): void {
    this.loading = true;
    this.error = '';

    this.tmdbService.getMoviesByGenre(genreId, page).pipe(
      catchError(err => {
        console.error('Error loading movies:', err);
        this.error = 'Error al cargar las películas.';
        return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
      })
    ).subscribe(response => {
      this.loading = false;
      this.movies = response.results;
      this.totalResults = response.total_results;
      this.totalPages = response.total_pages;
      this.currentPage = page;
      this.cdr.detectChanges();
    });
  }

  onGenreSelect(genre: Genre): void {
    this.selectedGenre = genre;
    this.router.navigate(['/genre', genre.id]);
    this.loadMoviesByGenre(genre.id, 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isFavorite(movieId: number): boolean {
    return this.favoritesService.isFavorite(movieId);
  }

  onToggleFavorite(movie: Movie): void {
    if (this.favoritesService.isFavorite(movie.id)) {
      this.favoritesService.removeFavorite(movie.id);
    } else {
      this.favoritesService.addFavorite(movie);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage && this.selectedGenre) {
      this.loadMoviesByGenre(this.selectedGenre.id, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}