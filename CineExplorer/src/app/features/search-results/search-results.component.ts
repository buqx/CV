import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Movie } from '../../core/models';
import { MovieCardComponent } from '../../shared/components';
import { catchError, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private tmdbService = inject(TmdbService);
  private favoritesService = inject(FavoritesService);

  movies: Movie[] = [];
  totalResults = 0;
  totalPages = 0;
  currentPage = 1;
  loading = false;
  error = '';
  query = '';

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    /**
     * Solo respondemos a cambios de query params en la URL.
     * El NavbarComponent se encarga de la navegación con debounce.
     * Esto evita conflicto de doble búsqueda.
     */
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const newQuery = params['q'] || '';
      const newPage = parseInt(params['page'] || '1', 10);

      // Solo buscar si cambió el query o la página
      if (newQuery !== this.query || newPage !== this.currentPage) {
        this.query = newQuery;
        this.currentPage = newPage;
        if (this.query) {
          this.searchMovies(this.query, this.currentPage);
        } else {
          this.movies = [];
          this.totalResults = 0;
          this.totalPages = 0;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * searchMovies: Realiza la búsqueda en la API de TMDB.
   * Se llama cuando cambian los query params (navegación desde navbar).
   */
  searchMovies(query: string, page: number): void {
    this.loading = true;
    this.query = query;
    this.error = '';

    this.tmdbService.searchMovies(query, page).pipe(
      catchError(err => {
        console.error('Search error:', err);
        this.loading = false;
        this.error = 'Error al buscar películas. Verifica tu conexión.';
        return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
      })
    ).subscribe(response => {
      this.loading = false;
      this.movies = response.results;
      this.totalResults = response.total_results;
      this.totalPages = response.total_pages;
      this.currentPage = page;

      if (this.movies.length === 0 && this.totalResults === 0 && query) {
        this.error = `No se encontraron resultados para "${query}"`;
      }
    });
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

  /**
   * goToPage: Navega a una página específica de resultados.
   * Actualiza los query params para que la URL refleje el estado.
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      // Navegar a la misma página pero con diferente page param
      // El ngOnInit detectará el cambio y ejecutará searchMovies
      this.currentPage = page;
      this.searchMovies(this.query, page);
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