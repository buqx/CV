import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models';
import { StorageService } from './storage.service';

const FAVORITES_KEY = 'favorites';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageService = inject(StorageService);

  /**
   * BehaviorSubject: Es un tipo especial de Observable que:
   * 1. Mantiene el último valoremitido (accessible con .value)
   * 2. Notifica a todos los suscriptores cuando cambia
   * 3. Permite emitir nuevos valores con .next()
   *
   * ¿Por qué BehaviorSubject y no Subject?
   * Subject no mantiene el último valor. Si un componente se suscribe
   * después de que los datos ya fueron emitidos, no recibe nada.
   * BehaviorSubject siempre tiene un valor inicial, así que el componente
   * recibe el estado actual al suscribirse.
   */
  private favoritesSubject = new BehaviorSubject<Movie[]>([]);

  /**
   * favorites$: Observablepúblico (solo lectura).
   * El "$" al final es convención de Angular para indicar que es un Observable.
   * Componentes se suscriben a este para recibir actualizaciones de favoritos.
   */
  favorites$: Observable<Movie[]> = this.favoritesSubject.asObservable();

  /**
   * cantidad$: Observable derivado que emite la cantidad de favoritos.
   * Se crea con el operador pipe + map.
   * El async pipe en el template se suscribe automáticamente.
   */
  cantidad$: Observable<number> = this.favorites$.pipe(
    map(favs => favs.length)
  );

  constructor() {
    // Al iniciar el servicio, carga los favoritos desde localStorage
    this.loadFavorites();
  }

  /**
   * loadFavorites: Lee los favoritos guardados en localStorage.
   * Se llama automáticamente en el constructor.
   * Si no hay datos o hay error, inicializa con array vacío.
   */
  private loadFavorites(): void {
    const stored = this.storageService.getItem<Movie[]>(FAVORITES_KEY);
    if (stored) {
      this.favoritesSubject.next(stored);
    } else {
      this.favoritesSubject.next([]);
    }
  }

  /**
   * saveFavorites: Guarda el array actual de favoritos en localStorage.
   * Se llama después de cada modificación (add/remove/clear).
   */
  private saveFavorites(): void {
    this.storageService.setItem(FAVORITES_KEY, this.favoritesSubject.value);
  }

  /**
   * addFavorite: Agrega una película a favoritos.
   * @param movie - Película a agregar
   * @returns true si se agregó, false si ya existía
   *
   * Usa spread operator (...) para crear un nuevo array (inmutable).
   * Esto es importante porque BehaviorSubject compara por referencia,
   * entonces crear un nuevo array asegura que se notifique a los suscriptores.
   */
  addFavorite(movie: Movie): boolean {
    const actuales = this.favoritesSubject.value;
    if (!actuales.find(m => m.id === movie.id)) {
      this.favoritesSubject.next([...actuales, movie]);
      this.saveFavorites();
      return true;
    }
    return false;
  }

  /**
   * removeFavorite: Elimina una película de favoritos.
   * @param movieId - ID de la película a eliminar
   * @returns true si se eliminó, false si no existía
   */
  removeFavorite(movieId: number): boolean {
    const actuales = this.favoritesSubject.value;
    const nuevas = actuales.filter(m => m.id !== movieId);
    if (nuevas.length !== actuales.length) {
      this.favoritesSubject.next(nuevas);
      this.saveFavorites();
      return true;
    }
    return false;
  }

  /**
   * getAllFavorites: Retorna todas las películas favoritas.
   * Útil para operaciones síncronas donde no queremos suscribirnos.
   */
  getAllFavorites(): Movie[] {
    return this.favoritesSubject.value;
  }

  /**
   * isFavorite: Verifica si una película está en favoritos.
   * @param movieId - ID de la película a verificar
   */
  isFavorite(movieId: number): boolean {
    return this.favoritesSubject.value.some(m => m.id === movieId);
  }

  /**
   * clearAll: Elimina todos los favoritos.
   * Útil para implementar un "borrar todo" en la UI.
   */
  clearAll(): void {
    this.favoritesSubject.next([]);
    this.saveFavorites();
  }

  /**
   * getCantidad: Retorna la cantidad de favoritos (síncrono).
   * Alternativa a usar el observable cantidad$.
   */
  getCantidad(): number {
    return this.favoritesSubject.value.length;
  }

  /**
   * toggle: Agrega si no existe, elimina si existe.
   * Método conveniente para el botón de favorito en la UI.
   */
  toggle(movie: Movie): void {
    if (this.isFavorite(movie.id)) {
      this.removeFavorite(movie.id);
    } else {
      this.addFavorite(movie);
    }
  }
}