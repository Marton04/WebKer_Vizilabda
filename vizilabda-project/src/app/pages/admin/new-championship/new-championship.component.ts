import { Component } from '@angular/core';
import { ChampionshipService } from '../../../services/championship.service';
import { Championship, Team } from '../../../models/championship.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
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
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './new-championship.component.html',
  styleUrl: './new-championship.component.scss'
})
export class NewChampionshipComponent {
  championshipForm: FormGroup;

  allTeams: Team[] = [];
  selectedTeamIds: number[] = [];
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

    this.allTeams = this.championshipService.getTeams();
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

    // Ellenőrzés: új csapatnevek ne legyenek üresek
    const invalidTeam = this.newTeams.find(
      team => !team.name || team.name.trim().length === 0
    );

    if (invalidTeam) {
      alert('Kérlek, adj nevet minden új csapatnak!');
      return;
    }

    // Meglévő csapatok lekérése
    const existingSelectedTeams = this.allTeams.filter(team =>
      this.selectedTeamIds.includes(team.id)
    );

    // Új csapatokat hozzáadjuk a szolgáltatáshoz
    for (let team of this.newTeams) {
      this.championshipService.addTeam(team);
    }

    const newChampionship: Championship = {
      name,
      teams: [...existingSelectedTeams, ...this.newTeams],
      matches: []
    };

    this.championshipService.addChampionship(newChampionship);
    alert('Bajnokság létrehozva!');

    // Űrlap és állapot alaphelyzetbe
    this.championshipForm.reset();
    this.selectedTeamIds = [];
    this.newTeams = [];
    this.startDate = null;
  }
}
