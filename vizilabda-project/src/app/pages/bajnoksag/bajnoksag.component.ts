import { Component } from '@angular/core';
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


interface Team {
  name: string;
  points: number;
}

interface Match {
  team1: string;
  team2: string;
  date: string;
  score1: any;
  score2: any;
}

interface Championship {
  name: string;
  teams: Team[];
  matches: Match[];
}

@Component({
  selector: 'app-bajnoksag',
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
export class BajnoksagComponent {
  championships: Championship[] = [
    {
      name: 'Vízilabda Bajnokság 2025',
      teams: [
        { name: 'Csapat A',points:2},
        { name: 'Csapat B',points:5}
      ],
      matches: [
        { team1: 'Csapat C', team2: 'Csapat D', date: '2025-07-15', score1: null, score2: null },
        { team1: 'Csapat A', team2: 'Csapat B', date: '2025-06-10', score1: null, score2: null },
        { team1: 'Csapat A', team2: 'Csapat B', date: '2025-06-12', score1: null, score2: null },
        { team1: 'Csapat A', team2: 'Csapat B', date: '2024-06-10', score1: 2, score2: 1 },
        { team1: 'Csapat A', team2: 'Csapat B', date: '2025-06-19', score1: null, score2: null },
        { team1: 'Csapat E', team2: 'Csapat F', date: '2024-05-01', score1: 3, score2: 3 }
      ]
    },
    {
      name: 'Vízilabda Kupa 2025',
      teams: [
        { name: 'Csapat C',points:11},
        { name: 'Csapat D',points:0}
      ],
      matches: [
        { team1: 'Csapat C', team2: 'Csapat D', date: '2025-07-15', score1: null, score2: null },
        { team1: 'Csapat A', team2: 'Csapat B', date: '2025-06-10', score1: null, score2: null },
        { team1: 'Csapat A', team2: 'Csapat B', date: '2025-06-12', score1: null, score2: null },
        { team1: 'Csapat A', team2: 'Csapat B', date: '2024-06-10', score1: 2, score2: 1 },
        { team1: 'Csapat A', team2: 'Csapat B', date: '2025-06-19', score1: null, score2: null },
        { team1: 'Csapat E', team2: 'Csapat F', date: '2024-05-01', score1: 3, score2: 3 }
      ]
    }
  ];

  selectedChampionship: Championship | null = null;

  selectChampionship(championship: Championship) {
    this.selectedChampionship = championship;
  }
  displayedColumns: string[] = ['team1', 'result', 'team2', 'date'];

}