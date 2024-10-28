import { inject, Injectable } from '@angular/core';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, DocumentReference, getDoc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);
  constructor() { }

  // Read
  getDocument<tipo>(path: string){
    const document= doc(this.firestore, path) as DocumentReference<tipo, any>;
    return getDoc<tipo, any>(document);
  }

  getCollectionChanges<tipo>(path: string){
    const refCollecion= collection(this.firestore, path);
    return collectionData(refCollecion) as Observable<tipo[]>;
  }

  getDocumentChanges<tipo>(path: string){
    console.log('getDocumentChanges -> ', path);
    const document= doc(this.firestore, path);
    return docData(document) as Observable<tipo[]>;
  }

  //Create 
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

  
  //Delete
  deleteDocumentID(path: string, idDoc: string){
    const document= doc(this.firestore, `${path}/${idDoc}`);
    console.log("Se va a eliminar el ID: " + idDoc);
    return deleteDoc(document);
  }
  
}
