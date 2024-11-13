# Firebase

Vamos a profundizar en cada uno de los servicios de Firebase que podrías utilizar en tu aplicación con Ionic y Angular.

### 1. **Firebase Authentication**

Firebase Authentication proporciona una forma sencilla de autenticar a los usuarios en tu aplicación. Soporta varios métodos de autenticación, incluyendo correo electrónico y contraseña, proveedores de identidad federada como Google, Facebook, y más.

#### Configuración de Firebase Authentication:

1. **Registrar tu aplicación en Firebase Console:**
   - Ve a [Firebase Console](https://console.firebase.google.com/).
   - Crea un nuevo proyecto o selecciona uno existente.
   - Agrega tu aplicación (iOS, Android o Web) y sigue las instrucciones para obtener la configuración de Firebase.

2. **Instalar Firebase en tu proyecto:**
   ```bash
   npm install firebase @angular/fire
   ```

3. **Configurar Firebase en tu aplicación Angular:**
   - En 

environment.ts

, agrega tu configuración de Firebase:
     ```typescript
     export const environment = {
       production: false,
       firebase: {
         apiKey: "YOUR_API_KEY",
         authDomain: "YOUR_AUTH_DOMAIN",
         projectId: "YOUR_PROJECT_ID",
         storageBucket: "YOUR_STORAGE_BUCKET",
         messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
         appId: "YOUR_APP_ID"
       }
     };
     ```

   - En `app.module.ts`, importa y configura AngularFire:
     ```typescript
     import { AngularFireModule } from '@angular/fire';
     import { AngularFireAuthModule } from '@angular/fire/auth';
     import { environment } from '../environments/environment';

     @NgModule({
       declarations: [AppComponent],
       imports: [
         BrowserModule,
         AngularFireModule.initializeApp(environment.firebase),
         AngularFireAuthModule
       ],
       providers: [],
       bootstrap: [AppComponent]
     })
     export class AppModule { }
     ```

4. **Implementar autenticación en tu aplicación:**
   - En tu servicio de autenticación (`auth.service.ts`):
     ```typescript
     import { Injectable } from '@angular/core';
     import { AngularFireAuth } from '@angular/fire/auth';
     import firebase from 'firebase/app';

     @Injectable({
       providedIn: 'root'
     })
     export class AuthService {
       constructor(private afAuth: AngularFireAuth) {}

       login(email: string, password: string) {
         return this.afAuth.signInWithEmailAndPassword(email, password);
       }

       logout() {
         return this.afAuth.signOut();
       }

       register(email: string, password: string) {
         return this.afAuth.createUserWithEmailAndPassword(email, password);
       }

       loginWithGoogle() {
         return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
       }
     }
     ```

5. **Uso en componentes:**
   - En tu componente (`login.component.ts`):
     ```typescript
     import { Component } from '@angular/core';
     import { AuthService } from './auth.service';

     @Component({
       selector: 'app-login',
       templateUrl: './login.component.html',
       styleUrls: ['./login.component.css']
     })
     export class LoginComponent {
       email: string;
       password: string;

       constructor(private authService: AuthService) {}

       login() {
         this.authService.login(this.email, this.password).then(res => {
           console.log('Logged in successfully', res);
         }).catch(err => {
           console.error('Login error', err);
         });
       }

       loginWithGoogle() {
         this.authService.loginWithGoogle().then(res => {
           console.log('Logged in with Google', res);
         }).catch(err => {
           console.error('Google login error', err);
         });
       }
     }
     ```

### 2. **Cloud Firestore**

Cloud Firestore es una base de datos NoSQL en tiempo real que te permite almacenar y sincronizar datos entre tus usuarios.

#### Configuración de Cloud Firestore:

1. **Habilitar Firestore en Firebase Console:**
   - Ve a la sección de Firestore Database en Firebase Console.
   - Crea una base de datos y selecciona el modo de inicio (producción o prueba).

2. **Configurar Firestore en tu aplicación Angular:**
   - En `app.module.ts`, importa y configura AngularFireFirestore:
     ```typescript
     import { AngularFirestoreModule } from '@angular/fire/firestore';

     @NgModule({
       imports: [
         AngularFireModule.initializeApp(environment.firebase),
         AngularFirestoreModule
       ]
     })
     export class AppModule { }
     ```

3. **Usar Firestore en tu aplicación:**
   - En tu servicio de Firestore (`firestore.service.ts`):
     ```typescript
     import { Injectable } from '@angular/core';
     import { AngularFirestore } from '@angular/fire/firestore';

     @Injectable({
       providedIn: 'root'
     })
     export class FirestoreService {
       constructor(private firestore: AngularFirestore) {}

       getCollection(collection: string) {
         return this.firestore.collection(collection).snapshotChanges();
       }

       addDocument(collection: string, data: any) {
         return this.firestore.collection(collection).add(data);
       }

       updateDocument(collection: string, id: string, data: any) {
         return this.firestore.collection(collection).doc(id).update(data);
       }

       deleteDocument(collection: string, id: string) {
         return this.firestore.collection(collection).doc(id).delete();
       }
     }
     ```

4. **Uso en componentes:**
   - En tu componente (`items.component.ts`):
     ```typescript
     import { Component, OnInit } from '@angular/core';
     import { FirestoreService } from './firestore.service';

     @Component({
       selector: 'app-items',
       templateUrl: './items.component.html',
       styleUrls: ['./items.component.css']
     })
     export class ItemsComponent implements OnInit {
       items: any[];

       constructor(private firestoreService: FirestoreService) {}

       ngOnInit() {
         this.firestoreService.getCollection('items').subscribe(data => {
           this.items = data.map(e => {
             return {
               id: e.payload.doc.id,
               ...e.payload.doc.data()
             };
           });
         });
       }

       addItem(item: any) {
         this.firestoreService.addDocument('items', item);
       }

       updateItem(id: string, item: any) {
         this.firestoreService.updateDocument('items', id, item);
       }

       deleteItem(id: string) {
         this.firestoreService.deleteDocument('items', id);
       }
     }
     ```

### 3. **Firebase Storage**

Firebase Storage te permite almacenar y servir contenido generado por el usuario, como fotos y videos.

#### Configuración de Firebase Storage:

1. **Habilitar Storage en Firebase Console:**
   - Ve a la sección de Storage en Firebase Console.
   - Configura las reglas de seguridad según tus necesidades.

2. **Configurar Storage en tu aplicación Angular:**
   - En `app.module.ts`, importa y configura AngularFireStorage:
     ```typescript
     import { AngularFireStorageModule } from '@angular/fire/storage';

     @NgModule({
       imports: [
         AngularFireModule.initializeApp(environment.firebase),
         AngularFireStorageModule
       ]
     })
     export class AppModule { }
     ```

3. **Usar Storage en tu aplicación:**
   - En tu servicio de Storage (`storage.service.ts`):
     ```typescript
     import { Injectable } from '@angular/core';
     import { AngularFireStorage } from '@angular/fire/storage';
     import { finalize } from 'rxjs/operators';

     @Injectable({
       providedIn: 'root'
     })
     export class StorageService {
       constructor(private storage: AngularFireStorage) {}

       uploadFile(filePath: string, file: File) {
         const fileRef = this.storage.ref(filePath);
         const task = this.storage.upload(filePath, file);

         return task.snapshotChanges().pipe(
           finalize(() => fileRef.getDownloadURL())
         );
       }

       deleteFile(filePath: string) {
         return this.storage.ref(filePath).delete();
       }
     }
     ```

4. **Uso en componentes:**
   - En tu componente (`upload.component.ts`):
     ```typescript
     import { Component } from '@angular/core';
     import { StorageService } from './storage.service';

     @Component({
       selector: 'app-upload',
       templateUrl: './upload.component.html',
       styleUrls: ['./upload.component.css']
     })
     export class UploadComponent {
       selectedFile: File = null;

       constructor(private storageService: StorageService) {}

       onFileSelected(event) {
         this.selectedFile = event.target.files[0];
       }

       onUpload() {
         const filePath = `uploads/${this.selectedFile.name}`;
         this.storageService.uploadFile(filePath, this.selectedFile).subscribe(url => {
           console.log('File uploaded successfully, URL:', url);
         });
       }
     }
     ```

### 4. **Firebase Cloud Functions**

Firebase Cloud Functions te permite ejecutar código backend en respuesta a eventos activados por Firebase.

#### Configuración de Cloud Functions:

1. **Instalar Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Inicializar Cloud Functions en tu proyecto:**
   ```bash
   firebase init functions
   ```

3. **Escribir y desplegar funciones:**
   - En `functions/index.js`:
     ```javascript
     const functions = require('firebase-functions');
     const admin = require('firebase-admin');
     admin.initializeApp();

     exports.helloWorld = functions.https.onRequest((request, response) => {
       response.send("Hello from Firebase!");
     });
     ```

   - Desplegar funciones:
     ```bash
     firebase deploy --only functions
     ```

4. **Uso en tu aplicación Angular:**
   - En tu servicio de funciones (`functions.service.ts`):
     ```typescript
     import { Injectable } from '@angular/core';
     import { AngularFireFunctions } from '@angular/fire/functions';

     @Injectable({
       providedIn: 'root'
     })
     export class FunctionsService {
       constructor(private functions: AngularFireFunctions) {}

       callHelloWorld() {
         const callable = this.functions.httpsCallable('helloWorld');
         return callable({});
       }
     }
     ```

   - En tu componente (`functions.component.ts`):
     ```typescript
     import { Component } from '@angular/core';
     import { FunctionsService } from './functions.service';

     @Component({
       selector: 'app-functions',
       templateUrl: './functions.component.html',
       styleUrls: ['./functions.component.css']
     })
     export class FunctionsComponent {
       constructor(private functionsService: FunctionsService) {}

       callFunction() {
         this.functionsService.callHelloWorld().subscribe(response => {
           console.log('Function response:', response);
         });
       }
     }
     ```

### 5. **Firebase Hosting**

Firebase Hosting te permite alojar tu aplicación web de manera rápida y segura.

#### Configuración de Firebase Hosting:

1. **Inicializar Firebase Hosting en tu proyecto:**
   ```bash
   firebase init hosting
   ```

2. **Desplegar tu aplicación:**
   ```bash
   ng build --prod
   firebase deploy --only hosting
   ```

### 6. **Firebase Analytics**

Firebase Analytics te permite obtener información detallada sobre el uso de tu aplicación.

#### Configuración de Firebase Analytics:

1. **Habilitar Analytics en Firebase Console:**
   - Ve a la sección de Analytics en Firebase Console.
   - Configura Analytics según tus necesidades.

2. **Configurar Analytics en tu aplicación Angular:**
   - En `app.module.ts`, importa y configura AngularFireAnalytics:
     ```typescript
     import { AngularFireAnalyticsModule } from '@angular/fire/analytics';

     @NgModule({
       imports: [
         AngularFireModule.initializeApp(environment.firebase),
         AngularFireAnalyticsModule
       ]
     })
     export class AppModule { }
     ```

3. **Usar Analytics en tu aplicación:**
   - En tu servicio de Analytics (`analytics.service.ts`):
     ```typescript
     import { Injectable } from '@angular/core';
     import { AngularFireAnalytics } from '@angular/fire/analytics';

     @Injectable({
       providedIn: 'root'
     })
     export class AnalyticsService {
       constructor(private analytics: AngularFireAnalytics) {}

       logEvent(eventName: string, eventParams?: { [key: string]: any }) {
         this.analytics.logEvent(eventName, eventParams);
       }
     }
     ```

4. **Uso en componentes:**
   - En tu componente (`analytics.component.ts`):
     ```typescript
     import { Component } from '@angular/core';
     import { AnalyticsService } from './analytics.service';

     @Component({
       selector: 'app-analytics',
       templateUrl: './analytics.component.html',
       styleUrls: ['./analytics.component.css']
     })
     export class AnalyticsComponent {
       constructor(private analyticsService: AnalyticsService) {}

       logEvent() {
         this.analyticsService.logEvent('button_click', { button_name: 'test_button' });
       }
     }
     ```

Estos son los componentes principales de Firebase que podrías necesitar para tu aplicación. Cada uno de ellos tiene una documentación extensa y detallada en la [documentación oficial de Firebase](https://firebase.google.com/docs).
