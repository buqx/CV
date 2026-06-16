import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Movie } from '../../core/models/movie';
import { TmdbImagePipe, TruncatePipe } from '../../shared/pipes';
import { MovieCardComponent } from '../../shared/components';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent, TmdbImagePipe, TruncatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private tmdbService = inject(TmdbService);
  private favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  featuredMovie: Movie | null = null;
  popularMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];

  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      featured: this.tmdbService.getFeaturedMovie(),
      popular: this.tmdbService.getPopularMovies(),
      topRated: this.tmdbService.getTopRatedMovies(),
      upcoming: this.tmdbService.getUpcomingMovies()
    }).pipe(
      catchError(err => {
        console.error('Error loading data:', err);
        this.error = 'Error al cargar los datos. Por favor, verifica tu API key.';
        return of(null);
      })
    ).subscribe(response => {
      this.loading = false;
      if (response) {
        this.featuredMovie = response.featured.results[0] || null;
        this.popularMovies = response.popular.results;
        this.topRatedMovies = response.topRated.results;
        this.upcomingMovies = response.upcoming.results;
      }
      // Forzar detección de cambios
      this.cdr.detectChanges();
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

  reloadPopular(): void {
    this.tmdbService.getPopularMovies().subscribe(res => this.popularMovies = res.results);
  }

  reloadTopRated(): void {
    this.tmdbService.getTopRatedMovies().subscribe(res => this.topRatedMovies = res.results);
  }

  reloadUpcoming(): void {
    this.tmdbService.getUpcomingMovies().subscribe(res => this.upcomingMovies = res.results);
  }
}