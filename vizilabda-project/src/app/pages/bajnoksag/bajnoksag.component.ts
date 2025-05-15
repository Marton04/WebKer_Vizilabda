import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PontokPipePipe } from '../../shared/pontok.pipe.pipe';
import { SortByDatePipe } from '../../shared/sort-by-date.pipe';
import { ChampionshipService } from '../../services/championship.service';
import { Championship, Matchday } from '../../models/championship.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bajnoksag',
  standalone: true,
  imports: [
    PontokPipePipe,
    FormsModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './bajnoksag.component.html',
  styleUrls: ['./bajnoksag.component.scss']
})
export class BajnoksagComponent implements OnInit, OnDestroy {
  championships: Championship[] = [];
  selectedChampionship: Championship | null = null;
  selectedMatchday: Matchday | null = null;
  displayedColumns: string[] = ['team1', 'result', 'team2', 'date'];
  teamColumns: string[] = ['position', 'name', 'points'];
  private subscriptions: Subscription[] = [];

  constructor(private championshipService: ChampionshipService) {}

  ngOnInit(): void {
    this.loadChampionships();
  }

  loadChampionships(): void {
    const sub = this.championshipService.getChampionships().subscribe({
      next: (data: Championship[]) => {
        this.championships = data;
      },
      error: (err) => {
        console.error('Hiba a bajnokságok betöltésekor:', err);
      }
    });
    this.subscriptions.push(sub);
  }

  selectChampionship(championship: Championship): void {
    this.selectedChampionship = championship;
    this.selectedMatchday = championship.matchdays?.[0] || null;
  }

  onMatchdayChange(matchday: Matchday): void {
    this.selectedMatchday = matchday;
  }

  get displayedMatches() {
    return this.selectedMatchday ? this.selectedMatchday.matches : [];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
