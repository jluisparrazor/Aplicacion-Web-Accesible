import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);
  constructor() { }

  // Read
  getCollectionChanges<tipo>(path: string){
    const refCollecion= collection(this.firestore, path);
    return collectionData(refCollecion) as Observable<tipo[]>;
  }

  //Update 
  createDocument(data: any, path: string){
    const document= doc(this.firestore, path);
    return setDoc(document, data);
  }

  createDocumentID(data: any, path: string, idDoc: string){
    const document= doc(this.firestore, `${path}/${idDoc}`); //Mandamos path concatenado con el idDoc
    return setDoc(document, data);
  }
  createIDDoc(){
    return uuidv4();
  }
}
