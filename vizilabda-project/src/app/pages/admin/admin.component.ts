import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NewChampionshipComponent}from './new-championship/new-championship.component' ;
import { EnterResultsComponent } from './enter-results/enter-results.component';
import { EditTeamComponent } from './edit-team/edit-team.component';

@Component({
  selector: 'app-admin',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    NewChampionshipComponent,
    EnterResultsComponent,
    EditTeamComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  selectedTab = 0;
}
