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
    this.selectedMatchday = championship.matchdays.length > 0 ? championship.matchdays[0] : null;
  }

  onMatchdayChange(matchday: Matchday): void {
    this.selectedMatchday = matchday;
  }

  saveResults() {
    this.championshipService.saveAll(); // új metódus a ChampionshipService-ben a mentéshez
    alert('Eredmények mentve!');
  }

  get displayedMatches(): Match[] {
    return this.selectedMatchday ? this.selectedMatchday.matches : [];
  }
}
