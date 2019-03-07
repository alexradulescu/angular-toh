import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessagesService } from './messages.service';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class HeroService {
    private heroesUrl = 'api/heroes';

    constructor(
        private http: HttpClient,
        private messagesService: MessagesService,

    ) { }

    getHeroes() : Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
            tap(() => this.log('fetched Heroes') ),
            catchError(this.handleError('getHeroes', []))
            )
    }

    getHero(id: number) : Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url)
            .pipe(
                tap(() => {this.log(`Fetched hero with id:${id}`)}),
                catchError(this.handleError<Hero>('getHero'))
            )
    }

    updateHero(hero: Hero) : Observable<any> {
        return this.http.put(this.heroesUrl, hero, httpOptions)
            .pipe(
                tap(() => {this.log(`Updated hero: ${hero.name} : ${hero.id}`)}),
                catchError(this.handleError<any>('updateHero'))
            );
    }

    addHero(hero: Hero) : Observable<Hero> {
        return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
            .pipe(
                tap((newHero: Hero) => {this.log(`Hero creaed: ${newHero.name} : ${newHero.id}`)}),
                catchError(this.handleError<Hero>('addHero'))
            );
    }

    deleteHero(hero: Hero): Observable<any> {
        const url = `${this.heroesUrl}/${hero.id}`;
        return this.http.delete<Hero>(url, httpOptions)
            .pipe(
                tap(() => { this.log(`Hero deleted: ${hero.name} : ${hero.id}`)}),
                catchError(this.handleError<Hero>('deleteHero'))    
            );
    }

    searchHeros(term: string): Observable<Hero[]> {
        if (!term.trim()){
            return of([]);
        } else {
            return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
                .pipe(
                    tap(() => {
                        this.log(`Found heroes matching ${term}`);
                    }),
                    catchError(this.handleError<Hero[]>('searchHeroes', []))
                )
        }
    }

    private log(message) {
        this.messagesService.add(`HeroService: ${message}`);
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log(error);
            
            this.log(`${operation} failed with message ${error.message}`);
            return of(result as T )
        }
    }
}
