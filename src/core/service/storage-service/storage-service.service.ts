import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  private readonly isLocalStorageAvailable = typeof window !== 'undefined' && !!window.localStorage;
 
  setItem<T>(key: string, value: T): void {
    if (this.isLocalStorageAvailable) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn(`Erro ao salvar no localStorage: ${e}`);
      }
    }
  }

  getItem<T = any>(key: string): T | null {
    if (this.isLocalStorageAvailable) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          return JSON.parse(item);
        } catch (e) {
          console.warn(`Erro ao fazer parse do item '${key}' no localStorage: ${e}`);
          return null;
        }
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isLocalStorageAvailable) {
      localStorage.clear();
    }
  }

  exists(key: string): boolean {
    return this.isLocalStorageAvailable && localStorage.getItem(key) !== null;
  }

  updateItem<T>(key: string, updateFn: (oldValue: T | null) => T): void {
    const currentValue = this.getItem<T>(key);
    const newValue = updateFn(currentValue);
    this.setItem(key, newValue);
  }
  
}
