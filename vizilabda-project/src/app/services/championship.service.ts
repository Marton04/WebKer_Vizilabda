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

  constructor() {}

  getChampionships(): Championship[] {
    return this.championships;
  }

  getTeams(): Team[] {
    return this.teams;
  }

  updateTeam(updatedTeam: Team): void {
    const team = this.teams.find(t => t.id === updatedTeam.id);
    if (team) {
      team.name = updatedTeam.name;
      team.points = updatedTeam.points;
    }
  }
}
