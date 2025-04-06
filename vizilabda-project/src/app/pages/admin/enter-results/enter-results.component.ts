import { Component, OnInit } from '@angular/core';
import { ChampionshipService } from '../../../services/championship.service';
import { Championship, Matchday, Match } from '../../../models/championship.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-enter-results',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './enter-results.component.html',
  styleUrls: ['./enter-results.component.scss']
})
export class EnterResultsComponent implements OnInit {
  championships: Championship[] = [];
  selectedChampionship: Championship | null = null;
  selectedMatchday: Matchday | null = null;

  constructor(private championshipService: ChampionshipService) {}

  ngOnInit(): void {
    this.championships = this.championshipService.getChampionships();
  }

  selectChampionship(championship: Championship) {
    this.selectedChampionship = championship;
  
    if (championship.matchdays.length > 0) {
      this.selectedMatchday = championship.matchdays[0];
      this.onMatchdayChange(this.selectedMatchday); // <<< EZ A LÉNYEG!
    } else {
      this.selectedMatchday = null;
      this.originalScores.clear(); // biztos ami biztos
    }
  }
  
  originalScores: Map<Match, { score1: number, score2: number }> = new Map();


  onMatchdayChange(matchday: Matchday): void {
    this.selectedMatchday = matchday;
    // Eredeti eredmények elmentése
    this.originalScores.clear();
    matchday.matches.forEach(match => {
      if (match.score1 != null && match.score2 != null) {
        this.originalScores.set(match, {
          score1: match.score1,
          score2: match.score2
        });
      }
    });
    console.log(this.originalScores);
  }
 
  saveResults() {
    if (!this.selectedMatchday) return;
  
    this.selectedMatchday.matches.forEach(match => {
      const team1 = match.team1;
      const team2 = match.team2;
  
      if (!team1 || !team2 || match.score1 == null || match.score2 == null){
        match.score1=null
        match.score2=null
        return;
      } 
  
      if (team1.points == null) team1.points = 0;
      if (team2.points == null) team2.points = 0;
  
      // Levonás az előző pontszámok alapján
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
      
      // Új pontszám hozzáadása
      if (match.score1 > match.score2) {
        team1.points += 3;
      } else if (match.score2 > match.score1) {
        team2.points += 3;
      } else {
        team1.points += 1;
        team2.points += 1;
      }
      console.log(team1.points+" : "+team2.points);
  
      // Frissítsük az elmentett eredményt
      this.originalScores.set(match, { score1: match.score1, score2: match.score2 });
    });
  
    this.championshipService.saveAll();
    alert('Eredmények mentve, pontok frissítve!');
  }
  
  
  

  get displayedMatches(): Match[] {
    return this.selectedMatchday ? this.selectedMatchday.matches : [];
  }
}
