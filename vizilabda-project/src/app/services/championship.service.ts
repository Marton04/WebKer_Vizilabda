import { Injectable } from '@angular/core';
import { Championship, Team, Match, Matchday } from '../models/championship.model';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipService {
  private championships: Championship[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  getChampionships(): Championship[] {
    return this.championships;
  }

  addChampionship(championship: Championship): void {
    this.championships.push(championship);
    this.saveChampionshipsToLocalStorage();
  }

  saveAll(): void {
    this.saveChampionshipsToLocalStorage();
  }

  private saveChampionshipsToLocalStorage(): void {
    localStorage.setItem('championships', JSON.stringify(this.championships));
  }

  private loadFromLocalStorage(): void {
    const storedChamps = localStorage.getItem('championships');
  
    if (storedChamps) {
      const champs: Championship[] = JSON.parse(storedChamps);
      this.championships = champs.map(ch => {
        const reconstructedTeams = ch.teams;
        const reconstructedMatchdays = ch.matchdays.map((md: Matchday) => {
          const reconstructedMatches = md.matches.map((m: Match) => {
            return {
              ...m,
              team1: m.team1,
              team2: m.team2
            };
          });
  
          return {
            ...md,
            matches: reconstructedMatches
          };
        });
  
        return {
          ...ch,
          teams: reconstructedTeams,
          matchdays: reconstructedMatchdays
        };
      });
    }
  }  
}