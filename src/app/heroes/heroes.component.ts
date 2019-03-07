import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
    selector: 'app-heroes',
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {
    heroes        : Hero[];
    selectedHero  : Hero;
    newHeroName   : string;

    constructor(private heroService: HeroService) { }

    ngOnInit() {
        this.getHeroes();
    }

    getHeroes() : void {
        this.heroService.getHeroes()
            .subscribe(heroes => {
            this.heroes = heroes;
            });
    }

    add(): void {
        if (this.newHeroName) { this.newHeroName.trim(); }
        if (!this.newHeroName) { return; }
        this.heroService.addHero({name:this.newHeroName} as Hero)
            .subscribe(hero => { 
                this.heroes.push(hero);
                this.newHeroName = '';
            })
    }

    delete(hero: Hero): void {
        this.heroService.deleteHero(hero)
            .subscribe(() => {
                this.heroes = this.heroes.filter(h => h !== hero);
            });
    }

}
