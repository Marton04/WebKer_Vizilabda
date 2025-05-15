import { Injectable } from '@angular/core';
import { Championship, Team, Match, Matchday } from '../models/championship.model';
import { Firestore, collection,collectionData, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc, where } from '@angular/fire/firestore';
import { Observable, from, switchMap, map, of, take, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipService {
  private championships: Championship[] = [];

  constructor(private firestore: Firestore) {}

 getChampionships(): Observable<Championship[]> {
    const champRef = collection(this.firestore, 'Championships');
    return collectionData(champRef, { idField: 'id' }).pipe(
      map((data) => data.map(item => item as Championship))
    );
  }
  addChampionship(championship: Championship): Promise<void> {
  const champRef = collection(this.firestore, 'Championships');
  return addDoc(champRef, championship).then(() => {
    console.log('Bajnokság mentve Firebase-be');
  }).catch(error => {
    console.error('Hiba a bajnokság mentésénél:', error);
  });
}

  updateChampionship(championshipId: string, updatedData: Partial<Championship>): Promise<void> {
  const champDocRef = doc(this.firestore, 'Championships', championshipId);
  return updateDoc(champDocRef, updatedData);
}

  private saveChampionshipsToLocalStorage(): void {
    localStorage.setItem('championships', JSON.stringify(this.championships));
  }

 
}