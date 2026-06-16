import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly prefix = 'cineexplorer_';

  /**
   * getItem: Obtiene un valor del localStorage.
   * @param key - Clave sin prefijo (se agrega automáticamente)
   * @returns El valor parseado o null si no existe
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * setItem: Guarda un valor en localStorage.
   * @param key - Clave sin prefijo
   * @param value - Valor a guardar (se stringify automáticamente)
   */
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  /**
   * removeItem: Elimina un valor del localStorage.
   * @param key - Clave sin prefijo
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  /**
   * clear: Elimina todos los valores del proyecto.
   * Usa el prefijo para solo eliminar datos de CineExplorer.
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}