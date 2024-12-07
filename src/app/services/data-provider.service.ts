import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { HeroModel } from '../models';
import { generateUniqueId } from '../utils';
import { LocalStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}
  private readonly DATA_URL = 'assets/wikipedia_marvel_data.json';


  LoadData(): Observable<HeroModel[]> {
    const heroesFromStorage = this.localStorageService.loadHeroes();
    if (heroesFromStorage && heroesFromStorage.length > 0) {
      return of(heroesFromStorage);
    } else
    return this.http.get<HeroModel[]>(this.DATA_URL).pipe(map( hero=> ({...hero, id: generateUniqueId()})));
  }

  saveHeroes(heroes: HeroModel[]): void {
    this.localStorageService.saveHeroes(heroes);
  }

}
