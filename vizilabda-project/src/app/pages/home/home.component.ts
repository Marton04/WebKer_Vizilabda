import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ChampionshipService } from '../../services/championship.service';
import { Team, Match, Matchday, Championship } from '../../models/championship.model';

@Component({
  selector: 'app-home',
  imports: [
    MatButton,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isLoggedIn = false;

  constructor(private championshipService: ChampionshipService) {}

  ngOnInit(): void {
    this.checkLoginStatus();

    const existing = this.championshipService.getChampionships();
    if (!existing || existing.length === 0) {
      this.createDefaultChampionship();
    }
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  private createDefaultChampionship() {
    const teams: Team[] = [
      { id: 0, name: 'Ferencváros', points: 0 },
      { id: 1, name: 'Szolnok', points: 0 },
      { id: 2, name: 'OSC', points: 0 },
      { id: 3, name: 'Eger', points: 0 },
      { id: 4, name: 'Vasas', points: 0 },
      { id: 5, name: 'BVSC', points: 0 }
    ];

    const startDate = new Date();

    const matchdays = this.generateDoubleRoundRobinSchedule([...teams], startDate);
    this.addMatchResults(matchdays);
    this.updateTeamPoints(teams, matchdays);

    const defaultChampionship: Championship = {
      name: 'Magyar Vízilabda Bajnokság',
      teams,
      matchdays
    };

    this.championshipService.addChampionship(defaultChampionship);
  }

  private generateDoubleRoundRobinSchedule(teams: Team[], startDate: Date): Matchday[] {
    const n = teams.length;
    const rounds = n - 1;
    let teamsList = [...teams];
    const firstLeg: Match[][] = [];

    for (let round = 0; round < rounds; round++) {
      const roundMatches: Match[] = [];
      for (let i = 0; i < n / 2; i++) {
        roundMatches.push({
          team1: teamsList[i],
          team2: teamsList[n - 1 - i],
          date: '',
          score1: null,
          score2: null
        });
      }
      firstLeg.push(roundMatches);
      teamsList = [teamsList[0], ...teamsList.slice(-1), ...teamsList.slice(1, -1)];
    }

    const secondLeg: Match[][] = firstLeg.map(roundMatches =>
      roundMatches.map(match => ({
        team1: match.team2,
        team2: match.team1,
        date: '',
        score1: null,
        score2: null
      }))
    );

    const matchdays: Matchday[] = [];
    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    let currentDate = new Date(startDate);
    for (let i = 0; i < rounds; i++) {
      firstLeg[i].forEach(match => match.date = currentDate.toISOString());
      matchdays.push({
        date: currentDate.toISOString(),
        matches: firstLeg[i]
      });
      currentDate = addDays(currentDate, 7);
    }
    for (let i = 0; i < rounds; i++) {
      secondLeg[i].forEach(match => match.date = currentDate.toISOString());
      matchdays.push({
        date: currentDate.toISOString(),
        matches: secondLeg[i]
      });
      currentDate = addDays(currentDate, 7);
    }

    return matchdays;
  }

  private addMatchResults(matchdays: Matchday[]): void {
    for (const matchday of matchdays) {
      for (const match of matchday.matches) {
        match.score1 = Math.floor(Math.random() * 10);
        match.score2 = Math.floor(Math.random() * 10);
      }
    }
  }

  private updateTeamPoints(teams: Team[], matchdays: Matchday[]): void {
    const teamPoints: { [key: string]: number } = {};
    teams.forEach(team => teamPoints[team.name] = 0);

    for (const matchday of matchdays) {
      for (const match of matchday.matches) {
        if (match.score1 != null && match.score2 != null) {
          if (match.score1 > match.score2) {
            teamPoints[match.team1.name] += 3;
          } else if (match.score1 < match.score2) {
            teamPoints[match.team2.name] += 3;
          } else {
            teamPoints[match.team1.name] += 1;
            teamPoints[match.team2.name] += 1;
          }
        }
      }
    }

    teams.forEach(team => team.points = teamPoints[team.name]);
  }
}
