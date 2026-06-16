import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  /**
   * size: Tamaño del spinner.
   * Opciones: 'sm' (pequeño), 'md' (mediano), 'lg' (grande)
   * Default: 'md'
   */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * message: Mensaje de texto opcional que se muestra debajo del spinner.
   * Ejemplo: "Cargando películas..."
   */
  @Input() message = 'Cargando...';

  /**
   * color: Color del spinner.
   * Opciones: 'primary' (azul), 'white' (blanco), 'dark' (gris oscuro)
   * Default: 'primary'
   */
  @Input() color: 'primary' | 'white' | 'dark' = 'primary';

  /**
   * fullScreen: Si es true, el spinner ocupa toda la pantalla.
   * Útil para cargando inicial de la aplicación.
   */
  @Input() fullScreen = false;

  /**
   * getSizeClass: Retorna la clase CSS según el tamaño seleccionado.
   * Se usa en el template para aplicar los estilos apropiados.
   */
  getSizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'spinner-border--sm';
      case 'lg':
        return 'spinner-border--lg';
      default:
        return 'spinner-border--md';
    }
  }

  /**
   * getColorClass: Retorna la clase CSS según el color seleccionado.
   * Bootstrap usa classes 'text-primary', 'text-white', etc.
   */
  getColorClass(): string {
    switch (this.color) {
      case 'white':
        return 'text-white';
      case 'dark':
        return 'text-dark';
      default:
        return 'text-primary';
    }
  }
}