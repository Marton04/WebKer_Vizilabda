import { Injectable } from '@angular/core';
import { Championship, Team } from '../models/championship.model';

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
      matches: [
        { team1: this.teams[2], team2: this.teams[3], date: '2025-07-15', score1: null, score2: null },
        { team1: this.teams[0], team2: this.teams[1], date: '2025-06-10', score1: null, score2: null }
      ]
    },
    {
      name: 'Vízilabda Kupa 2025',
      teams: [this.teams[2], this.teams[3]],
      matches: [
        { team1: this.teams[2], team2: this.teams[3], date: '2025-07-15', score1: null, score2: null },
        { team1: this.teams[0], team2: this.teams[1], date: '2025-06-10', score1: null, score2: null }
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
      // Mivel team-ek referenciák, újra be kell őket állítani:
      this.championships = champs.map(ch => ({
        ...ch,
        teams: ch.teams.map(t => this.teams.find(team => team.id === t.id)!).filter(Boolean),
        matches: ch.matches.map(m => ({
          ...m,
          team1: this.teams.find(t => t.id === m.team1.id)!, // feltételezve, hogy Match.team1 és team2 is Team típusú
          team2: this.teams.find(t => t.id === m.team2.id)!
        }))
      }));
    }
  }
}
