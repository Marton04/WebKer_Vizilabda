import { Component, OnInit } from '@angular/core';
import { ChampionshipService } from '../../../services/championship.service';
import { Championship, Matchday, Match } from '../../../models/championship.model';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-enter-results',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './enter-results.component.html',
  styleUrls: ['./enter-results.component.scss']
})
export class EnterResultsComponent implements OnInit {
  championships: Championship[] = [];
  selectedChampionship: Championship | null = null;
  selectedMatchday: Matchday | null = null;
  originalScores: Map<Match, { score1: number, score2: number }> = new Map();

  constructor(
    private championshipService: ChampionshipService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const uid = this.authService.getCurrentUserId();
    console.log('Bejelentkezett felhasználó UID:', uid);
    if (!uid) {
      alert('Nem vagy bejelentkezve. Csak saját bajnokságokat lehet szerkeszteni.');
      return;
    }

    this.championshipService.getChampionshipsByUser(uid).subscribe(champs => {
      this.championships = champs;
      console.log('Bajnokságok:', champs);
    });
  }

  selectChampionship(championship: Championship) {
    this.selectedChampionship = championship;

    if (championship.matchdays.length > 0) {
      this.selectedMatchday = championship.matchdays[0];
      this.onMatchdayChange(this.selectedMatchday);
    } else {
      this.selectedMatchday = null;
      this.originalScores.clear();
    }
  }

  onMatchdayChange(matchday: Matchday): void {
    this.selectedMatchday = matchday;
    this.originalScores.clear();
    matchday.matches.forEach(match => {
      if (match.score1 != null && match.score2 != null) {
        this.originalScores.set(match, {
          score1: match.score1,
          score2: match.score2
        });
      }
    });
  }

  saveResults() {
    if (!this.selectedMatchday) return;

    if (this.displayedMatches.some(m => m.score1! < 0 || m.score2! < 0)) {
      alert('Az eredmények nem lehetnek negatívak!');
      return;
    }

    this.selectedMatchday.matches.forEach(match => {
      const team1 = this.selectedChampionship!.teams.find(t => t.id === match.team1.id);
      const team2 = this.selectedChampionship!.teams.find(t => t.id === match.team2.id);

      if (!team1 || !team2 || match.score1 == null || match.score2 == null) {
        match.score1 = null;
        match.score2 = null;
        return;
      }

      if (team1.points == null) team1.points = 0;
      if (team2.points == null) team2.points = 0;

      const original = this.originalScores.get(match);
      if (original) {
        const { score1: orig1, score2: orig2 } = original;
        if (orig1 > orig2) {
          team1.points -= 3;
        } else if (orig2 > orig1) {
          team2.points -= 3;
        } else {
          team1.points -= 1;
          team2.points -= 1;
        }
      }

      if (match.score1 > match.score2) {
        team1.points += 3;
      } else if (match.score2 > match.score1) {
        team2.points += 3;
      } else {
        team1.points += 1;
        team2.points += 1;
      }

      this.originalScores.set(match, { score1: match.score1, score2: match.score2 });
    });

    if (this.selectedChampionship && this.selectedChampionship.id) {
      this.championshipService.updateChampionship(
        this.selectedChampionship.id,
        {
          matchdays: this.selectedChampionship.matchdays,
          teams: this.selectedChampionship.teams
        }
      ).then(() => {
        alert('Eredmények mentve, pontok frissítve!');
      }).catch(err => {
        console.error('Mentési hiba:', err);
      });
    }
  }

  get displayedMatches(): Match[] {
    return this.selectedMatchday ? this.selectedMatchday.matches : [];
  }
  deleteChampionship(championship: Championship): void {
  if (confirm(`Biztosan törlöd a(z) "${championship.name}" bajnokságot? Ez nem visszavonható.`)) {
    this.championshipService.deleteChampionship(championship.id!)
      .then(() => {
        this.championships = this.championships.filter(c => c.id !== championship.id);
        if (this.selectedChampionship?.id === championship.id) {
          this.selectedChampionship = null;
          this.selectedMatchday = null;
          this.originalScores.clear();
        }
        alert('Bajnokság törölve.');
      })
      .catch(err => {
        console.error('Törlési hiba:', err);
        alert('Hiba történt a törlés közben.');
      });
  }
}
}
