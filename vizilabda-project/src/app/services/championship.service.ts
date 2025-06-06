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
  deleteChampionship(championshipId: string): Promise<void> {
    const champDocRef = doc(this.firestore, 'Championships', championshipId);
    return deleteDoc(champDocRef);
  }

  getChampionshipById(championshipId: string): Observable<Championship | undefined> {
    const champDocRef = doc(this.firestore, 'Championships', championshipId);
    return from(getDoc(champDocRef)).pipe(
      map(doc => doc.exists() ? { id: doc.id, ...doc.data() } as Championship : undefined)
    );
  }

  getChampionshipsByUser(uid: string): Observable<Championship[]> {
    const collRef = collection(this.firestore, 'Championships');
    const q = query(collRef, where('createdBy', '==', uid));
    return collectionData(q, { idField: 'id' }) as Observable<Championship[]>;
  }
 
  getChampionshipsByTeamCountQuery(minTeams: number): Observable<Championship[]> {
  const champRef = collection(this.firestore, 'Championships');
  const q = query(champRef, where('teamCount', '>=', minTeams));
  return collectionData(q, { idField: 'id' }).pipe(
    map(data => data as Championship[])
  );}
  getChampionshipsOrderedByDate(): Observable<Championship[]> {
  const champRef = collection(this.firestore, 'Championships');
  const q = query(champRef, orderBy('startDate', 'desc'));
  return collectionData(q, { idField: 'id' }).pipe(
    map(data => data as Championship[])
  );
}

getChampionshipsByDateAndMinTeams(minTeams: number): Observable<Championship[]> {
  const champRef = collection(this.firestore, 'Championships');
  const q = query(
    champRef,
    where('teamCount', '>=', minTeams),
    orderBy('teamCount'),
    orderBy('startDate', 'desc')
  );
  return collectionData(q, { idField: 'id' }).pipe(
    map(data => data as Championship[])
  );
}

}