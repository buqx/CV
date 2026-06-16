import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <!-- Navbar: Componente de navegación con búsqueda, géneros y favoritos -->
    <app-navbar></app-navbar>

    <!-- Main Content: Aquí se cargan las páginas según la ruta -->
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- Footer: Pie de página con información del desarrollador -->
    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <div class="site-footer__content">
          <div class="site-footer__brand">
            <span class="site-footer__icon">🎬</span>
            <span class="site-footer__text">CineExplorer</span>
          </div>
          <p class="site-footer__description">
            Desarrollado por Juan Esteban Valencia
          </p>
          <p class="site-footer__copyright">
            &copy; {{ currentYear }} CineExplorer. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 200px);
      padding-top: 1rem;
      padding-bottom: 2rem;
    }
  `]
})
export class App {
  /**
   * currentYear: Año actual para el copyright del footer.
   * Se actualiza automáticamente.
   */
  currentYear = new Date().getFullYear();
}