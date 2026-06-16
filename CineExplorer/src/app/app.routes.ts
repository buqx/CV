import { Routes } from '@angular/router';
import { hasFavoritesGuard } from './core/guards/has-favorites.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./features/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search-results/search-results.component').then(m => m.SearchResultsComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [hasFavoritesGuard]
  },
  {
    path: 'genre/:id',
    loadComponent: () => import('./features/genre-filter/genre-filter.component').then(m => m.GenreFilterComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];