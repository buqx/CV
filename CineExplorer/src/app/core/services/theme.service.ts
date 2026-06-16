import { Injectable, signal, effect, inject } from '@angular/core';
import { StorageService } from './storage.service';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageService = inject(StorageService);

  public currentTheme = signal<Theme>('light');

  constructor() {
    this.initTheme();

    /**
     * effect(): Angular ejecuta esta función cada vez que
     * el signal currentTheme cambia de valor.
     * No necesita suscripción manual - Angular lo detecta automáticamente.
     */
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);    // Aplica el tema al DOM
      this.saveTheme(theme);     // Guarda en localStorage
    });
  }

  /**
   * initTheme: Inicializa el tema al cargar la aplicación.
   * 1. Primero busca si hay un tema guardado en localStorage
   * 2. Si no hay, detecta la preferencia del sistema operativo
   * 3. Establece el tema inicial
   */
  private initTheme(): void {
    const storedTheme = this.storageService.getItem<Theme>(THEME_KEY);
    if (storedTheme) {
      this.currentTheme.set(storedTheme);
    } else {
      // Detecta preferencia del sistema: prefers-color-scheme: dark
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(prefersDark ? 'dark' : 'light');
    }
  }

  /**
   * saveTheme: Guarda el tema seleccionado en localStorage.
   * Usa StorageService para abstraer la lógica de localStorage.
   */
  private saveTheme(theme: Theme): void {
    this.storageService.setItem(THEME_KEY, theme);
  }

  /**
   * applyTheme: Aplica el tema al documento HTML.
   * El atributo data-theme en <html> activa los selectores CSS [data-theme="dark"]
   */
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * toggleTheme: Alterna entre tema claro y oscuro.
   * update() recibe el valor actual y retorna el nuevo valor.
   */
  toggleTheme(): void {
    this.currentTheme.update(current => current === 'light' ? 'dark' : 'light');
  }

  /**
   * setTheme: Establece un tema específico.
   * Útil para implementar un selector de temas en settings.
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }
}