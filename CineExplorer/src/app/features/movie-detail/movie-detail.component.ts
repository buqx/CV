import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Movie, MovieDetail, Credits, CastMember, CrewMember } from '../../core/models';
import { MovieCardComponent } from '../../shared/components';
import { TmdbImagePipe } from '../../shared/pipes';
import { ReviewForm } from './review-form/review-form.component';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, TmdbImagePipe, ReviewForm],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss'
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tmdbService = inject(TmdbService);
  private favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  movie: MovieDetail | null = null;
  credits: Credits | null = null;
  similarMovies: Movie[] = [];

  loading = true;
  error = '';

  get isFavorite(): boolean {
    return this.movie ? this.favoritesService.isFavorite(this.movie.id) : false;
  }

  get director(): CrewMember | undefined {
    return this.credits?.crew.find(c => c.job === 'Director');
  }

  get topCast(): CastMember[] {
    return this.credits?.cast.slice(0, 6) || [];
  }

  ngOnInit(): void {
    // Subscribe to paramMap changes to handle navigation between movies
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadMovieDetail(+id);
      }
    });
  }

  loadMovieDetail(id: number): void {
    this.loading = true;
    this.error = '';
    this.movie = null;

    forkJoin({
      detail: this.tmdbService.getMovieDetail(id).pipe(
        catchError(err => {
          console.error('Error loading detail:', err);
          return of(null);
        })
      ),
      credits: this.tmdbService.getMovieCredits(id).pipe(
        catchError(err => {
          console.error('Error loading credits:', err);
          return of({ id: 0, cast: [], crew: [] });
        })
      ),
      similar: this.tmdbService.getSimilarMovies(id).pipe(
        catchError(err => {
          console.error('Error loading similar:', err);
          return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
        })
      )
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.detail) {
          this.movie = response.detail;
          this.credits = response.credits;
          this.similarMovies = response.similar.results.slice(0, 6);
        } else {
          this.error = 'No se pudo cargar la película. Verifica tu conexión a internet.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('General error:', err);
        this.loading = false;
        this.error = 'Error al cargar los datos de la película.';
        this.cdr.detectChanges();
      }
    });
  }

  onToggleFavorite(): void {
    if (!this.movie) return;

    if (this.favoritesService.isFavorite(this.movie.id)) {
      this.favoritesService.removeFavorite(this.movie.id);
    } else {
      this.favoritesService.addFavorite(this.movie);
    }
  }

  onSimilarMovieClick(movie: Movie): void {
    this.router.navigate(['/movie', movie.id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formatRuntime(minutes: number | null): string {
    if (!minutes) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}