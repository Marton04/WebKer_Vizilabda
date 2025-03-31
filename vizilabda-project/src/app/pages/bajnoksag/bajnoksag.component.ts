import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PontokPipePipe } from '../../shared/pontok.pipe.pipe';


interface Team {
  name: string;
  points: number;
  players: string[];
}

interface Match {
  team1: string;
  team2: string;
  date: string;
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
    MatTableModule
  ],
  templateUrl: './bajnoksag.component.html',
  styleUrl: './bajnoksag.component.scss'
})
export class BajnoksagComponent {
  championships: Championship[] = [
    {
      name: 'Vízilabda Bajnokság 2025',
      teams: [
        { name: 'Csapat A',points:2, players: ['Játékos 1', 'Játékos 2', 'Játékos 3'] },
        { name: 'Csapat B',points:5, players: ['Játékos 4', 'Játékos 5', 'Játékos 6'] }
      ],
      matches: [
        { team1: 'Csapat A', team2: 'Csapat B', date: '2025-06-10' }
      ]
    },
    {
      name: 'Vízilabda Kupa 2025',
      teams: [
        { name: 'Csapat C',points:11, players: ['Játékos 7', 'Játékos 8', 'Játékos 9'] },
        { name: 'Csapat D',points:0, players: ['Játékos 10', 'Játékos 11', 'Játékos 12'] }
      ],
      matches: [
        { team1: 'Csapat C', team2: 'Csapat D', date: '2025-07-15' }
      ]
    }
  ];

  selectedChampionship: Championship | null = null;

  selectChampionship(championship: Championship) {
    this.selectedChampionship = championship;
  }
}