import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThemeService, FavoritesService, TmdbService } from '../../../core/services';
import { Genre } from '../../../core/models';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  protected themeService = inject(ThemeService);
  protected favoritesService = inject(FavoritesService);
  private tmdbService = inject(TmdbService);
  private router = inject(Router);

  searchControl = new FormControl('');
  genres: Genre[] = [];
  showGenreDropdown = false;
  showMobileMenu = false;

  get currentTheme(): string {
    return this.themeService.currentTheme();
  }

  ngOnInit(): void {
    this.loadGenres();

    // Búsqueda con debounce de 300ms
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.trim().length > 0) {
          this.router.navigate(['/search'], { queryParams: { q: query } });
        }
        return of(null);
      })
    ).subscribe();
  }

  /**
   * loadGenres: Carga la lista de géneros para el dropdown.
   * Se ejecuta una sola vez al iniciar el componente.
   */
  loadGenres(): void {
    this.tmdbService.getGenres().subscribe(response => {
      this.genres = response.genres;
    });
  }

  /**
   * toggleTheme: Alterna entre tema claro y oscuro.
   * Delega al ThemeService.
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * onSearchSubmit: Maneja el envío del formulario de búsqueda.
   * Navega a la página de resultados con el query.
   */
  onSearchSubmit(event: Event): void {
    event.preventDefault();
    const query = this.searchControl.value?.trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  /**
   * onGenreClick: Navega a la página de filtro por género.
   * Cierra el dropdown y el menú móvil después de hacer clic.
   */
  onGenreClick(genreId: number): void {
    this.router.navigate(['/genre', genreId]);
    this.showGenreDropdown = false;
    this.showMobileMenu = false;
  }

  /**
   * toggleGenreDropdown: Alterna la visibilidad del dropdown de géneros.
   */
  toggleGenreDropdown(): void {
    this.showGenreDropdown = !this.showGenreDropdown;
  }

  /**
   * toggleMobileMenu: Alterna la visibilidad del menú móvil.
   */
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  /**
   * closeMobileMenu: Cierra el menú móvil.
   * Se llama cuando el usuario hace clic en un enlace.
   */
  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }
}