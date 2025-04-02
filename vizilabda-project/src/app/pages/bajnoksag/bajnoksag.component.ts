import { Component, OnInit } from '@angular/core';
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
import { Championship, Team } from '../../models/championship.model';

@Component({
  selector: 'app-bajnoksag',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    PontokPipePipe,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    SortByDatePipe
  ],
  templateUrl: './bajnoksag.component.html',
  styleUrl: './bajnoksag.component.scss'
})
export class BajnoksagComponent implements OnInit {
  championships: Championship[] = [];
  selectedChampionship: Championship | null = null;
  displayedColumns: string[] = ['team1', 'result', 'team2', 'date'];

  constructor(private championshipService: ChampionshipService) {}

  ngOnInit(): void {
    this.championships = this.championshipService.getChampionships();
  }

  selectChampionship(championship: Championship) {
    this.selectedChampionship = championship;
  }
}
