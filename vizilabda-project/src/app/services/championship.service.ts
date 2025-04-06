import { Injectable } from '@angular/core';
import { Championship, Team, Match, Matchday } from '../models/championship.model';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipService {
  private teams: Team[] = [
    { id: 1, name: 'Csapat A', points: 2 },
    { id: 2, name: 'Csapat B', points: 5 },
    { id: 3, name: 'Csapat C', points: 11 },
    { id: 4, name: 'Csapat D', points: 0 }
  ];

  private championships: Championship[] = [
    {
      name: 'Vízilabda Bajnokság 2025',
      teams: [this.teams[0], this.teams[1]],
      matchdays: [
        {
          date: '2025-07-15',
          matches: [
            { team1: this.teams[2], team2: this.teams[3], date: '2025-07-15', score1: null, score2: null }
          ]
        },
        {
          date: '2025-06-10',
          matches: [
            { team1: this.teams[0], team2: this.teams[1], date: '2025-06-10', score1: null, score2: null }
          ]
        }
      ]
    },
    {
      name: 'Vízilabda Kupa 2025',
      teams: [this.teams[2], this.teams[3]],
      matchdays: [
        {
          date: '2025-07-15',
          matches: [
            { team1: this.teams[2], team2: this.teams[3], date: '2025-07-15', score1: null, score2: null }
          ]
        },
        {
          date: '2025-06-10',
          matches: [
            { team1: this.teams[0], team2: this.teams[1], date: '2025-06-10', score1: null, score2: null }
          ]
        }
      ]
    }
  ];

  constructor() {
    this.loadFromLocalStorage();
  }

  getChampionships(): Championship[] {
    return this.championships;
  }

  getTeams(): Team[] {
    return this.teams;
  }

  addTeam(team: Team): void {
    const newId = Math.max(...this.teams.map(t => t.id), 0) + 1;
    const newTeam = { ...team, id: newId };
    this.teams.push(newTeam);
    this.saveTeamsToLocalStorage();
  }

  addChampionship(championship: Championship): void {
    this.championships.push(championship);
    this.saveChampionshipsToLocalStorage();
  }
  
  updateTeam(updatedTeam: Team): void {
    const team = this.teams.find(t => t.id === updatedTeam.id);
    if (team) {
      team.name = updatedTeam.name;
      team.points = updatedTeam.points;
      this.saveTeamsToLocalStorage();
      this.saveChampionshipsToLocalStorage();
    }
  }

  private saveChampionshipsToLocalStorage(): void {
    localStorage.setItem('championships', JSON.stringify(this.championships));
  }
  
  private saveTeamsToLocalStorage(): void {
    localStorage.setItem('teams', JSON.stringify(this.teams));
  }
  
  private loadFromLocalStorage(): void {
    const storedChamps = localStorage.getItem('championships');
    const storedTeams = localStorage.getItem('teams');
  
    if (storedTeams) {
      this.teams = JSON.parse(storedTeams);
    }
  
    if (storedChamps) {
      const champs: Championship[] = JSON.parse(storedChamps);
  
      this.championships = champs.map(ch => {
        const reconstructedTeams = ch.teams
          .map(t => this.teams.find(team => team.id === t.id))
          .filter((t): t is Team => !!t); // Csak létező csapatokat használunk
  
        const reconstructedMatchdays = ch.matchdays.map((md: Matchday) => {
          const reconstructedMatches = md.matches.map((m: Match) => {
            const team1 = this.teams.find(t => t.id === m.team1.id);
            const team2 = this.teams.find(t => t.id === m.team2.id);
  
            if (!team1 || !team2) {
              console.warn('Nem található csapat a meccsnél', m);
            }
  
            return {
              ...m,
              team1: team1 ?? m.team1,
              team2: team2 ?? m.team2
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
