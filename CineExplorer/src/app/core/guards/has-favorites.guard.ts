import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';

export const hasFavoritesGuard: CanActivateFn = () => {
  const favoritesService = inject(FavoritesService);
  const router = inject(Router);

  if (favoritesService.getAllFavorites().length > 0) {
    return true;
  }

  router.navigate(['/']);
  return false;
};