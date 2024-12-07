import { Injectable } from '@angular/core';
import { HeroModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private localStorageKey = 'heroesData';

  constructor() {}

  loadHeroes(): HeroModel[] {
    const heroesData = localStorage.getItem(this.localStorageKey);
    if (heroesData) {
      return JSON.parse(heroesData);
    }
    return [];
  }

  saveHeroes(heroes: HeroModel[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(heroes));
  }
}
