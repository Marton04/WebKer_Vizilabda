import { Component } from '@angular/core';
import { ChampionshipService } from '../../../services/championship.service';
import { Championship, Team, Match, Matchday } from '../../../models/championship.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-championship',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './new-championship.component.html',
  styleUrls: ['./new-championship.component.scss']
})
export class NewChampionshipComponent {
  championshipForm: FormGroup;
  newTeams: Team[] = [];
  startDate: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private championshipService: ChampionshipService
  ) {
    this.championshipForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }

  addNewTeam() {
    this.newTeams.push({ id: 0, name: '', points: 0 });
  }

  removeNewTeam(index: number) {
    this.newTeams.splice(index, 1);
  }

  saveChampionship() {
    if (this.championshipForm.invalid) {
      alert('Kérlek, töltsd ki a bajnokság nevét és a kezdődátumot!');
      return;
    }

    const name = this.championshipForm.value.name;
    this.startDate = this.championshipForm.value.startDate;

    const invalidTeam = this.newTeams.find(
      team => !team.name || team.name.trim().length === 0
    );

    if (invalidTeam) {
      alert('Kérlek, adj nevet minden új csapatnak!');
      return;
    }
    if(this.newTeams.length%2!=0){
      alert('Kérlek páros számú csapatot adj meg');
      return;
    }
    // Új csapatok hozzáadása a szolgáltatáshoz
    for (let team of this.newTeams) {
      this.championshipService.addTeam(team);
    }

    // Generáljuk a mérkőzésrendet a megadott kezdődátumtól (feltételezzük, hogy a csapatok száma páros!)
    const matchdays: Matchday[] = this.generateDoubleRoundRobinSchedule([...this.newTeams], this.startDate!);

    const newChampionship: Championship = {
      name,
      teams: [...this.newTeams],
      matchdays
    };

    this.championshipService.addChampionship(newChampionship);
    alert('Bajnokság létrehozva!');

    // Alaphelyzetbe állítás
    this.championshipForm.reset();
    this.newTeams = [];
    this.startDate = null;
  }

  /**
   * Létrehoz egy dupla fordulós mérkőzésrendet úgy, hogy minden csapat otthon és idegenben is játszik.
   * A kezdődátumtól minden fordulóhoz hozzáadunk egy 7 napos eltolást.
   */
  private generateDoubleRoundRobinSchedule(teams: Team[], startDate: Date): Matchday[] {
    if (teams.length % 2 !== 0) {
      throw new Error('A csapatok számának párosnak kell lennie!');
    }
    const n = teams.length;
    const rounds = n - 1;
    let teamsList = [...teams];
    const firstLeg: Match[][] = [];

    // Generáljuk az első fordulós rendszert
    for (let round = 0; round < rounds; round++) {
      const roundMatches: Match[] = [];
      for (let i = 0; i < n / 2; i++) {
        roundMatches.push({
          team1: teamsList[i],
          team2: teamsList[n - 1 - i],
          date: '', // később állítjuk be
          score1: null,
          score2: null
        });
      }
      firstLeg.push(roundMatches);
      // Körforgás: az első csapat fix, a többi eltolódik
      teamsList = [teamsList[0], ...teamsList.slice(-1), ...teamsList.slice(1, -1)];
    }

    // Második fordulós rendszer: megcseréljük az otthoni és idegen párokat
    const secondLeg: Match[][] = firstLeg.map(roundMatches =>
      roundMatches.map(match => ({
        team1: match.team2,
        team2: match.team1,
        date: '',
        score1: null,
        score2: null
      }))
    );

    // Dátumok hozzárendelése: minden forduló 7 napos időközzel kezdődátumtól
    const matchdays: Matchday[] = [];
    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    let currentDate = new Date(startDate);
    // Első fordulós meccsnapsorozat
    for (let i = 0; i < rounds; i++) {
      firstLeg[i].forEach(match => match.date = currentDate.toISOString());
      matchdays.push({
        date: currentDate.toISOString(),
        matches: firstLeg[i]
      });
      currentDate = addDays(currentDate, 7);
    }
    // Második fordulós meccsnapsorozat
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
}
