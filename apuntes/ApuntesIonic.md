# Ionic

## 1. Iniciar la APP

Al crear una aplicación con Ionic, tienes varias opciones que puedes especificar en el comando `ionic start`. Aquí te explico cada una de ellas:

### Comando Básico
```bash
ionic start <nombre_proyecto> <plantilla> [opciones]
```

### Plantillas Disponibles
1. **blank**: Una plantilla en blanco, ideal para empezar desde cero.
2. **tabs**: Una plantilla con una interfaz de pestañas.
3. **sidemenu**: Una plantilla con un menú lateral.
4. **list**: Una plantilla con una lista de ejemplo.
5. **grid**: Una plantilla con una cuadrícula de ejemplo.
6. **tutorial**: Una plantilla con un tutorial de ejemplo.
7. **conference**: Una plantilla más compleja basada en la aplicación de conferencia de Ionic.

### Opciones Disponibles
1. **--type**: Especifica el framework a usar. Las opciones son `angular`, `react`, `vue`.
   ```bash
   ionic start myApp blank --type=angular
   ```

2. **--capacitor**: Usa Capacitor en lugar de Cordova para la integración nativa.
   ```bash
   ionic start myApp blank --capacitor
   ```

3. **--cordova**: Usa Cordova para la integración nativa.
   ```bash
   ionic start myApp blank --cordova
   ```

4. **--no-deps**: No instala dependencias automáticamente.
   ```bash
   ionic start myApp blank --no-deps
   ```

5. **--no-git**: No inicializa un repositorio Git.
   ```bash
   ionic start myApp blank --no-git
   ```

6. **--package-id**: Especifica un ID de paquete para la aplicación.
   ```bash
   ionic start myApp blank --package-id=com.example.myapp
   ```

7. **--project-id**: Especifica un ID de proyecto.
   ```bash
   ionic start myApp blank --project-id=myApp
   ```

8. **--display-name**: Especifica un nombre para mostrar de la aplicación.
   ```bash
   ionic start myApp blank --display-name="My App"
   ```

### Ejemplo Completo
```bash
ionic start myApp tabs --type=angular --capacitor --package-id=com.example.myapp --display-name="My App"
```

### Explicación de las Opciones
- **nombre_proyecto**: El nombre de tu proyecto.
- **plantilla**: La plantilla inicial que quieres usar (blank, tabs, sidemenu, etc.).
- **--type**: El framework que deseas usar (Angular, React, Vue).
- **--capacitor**: Indica que deseas usar Capacitor para la integración nativa.
- **--cordova**: Indica que deseas usar Cordova para la integración nativa.
- **--no-deps**: No instala las dependencias automáticamente.
- **--no-git**: No inicializa un repositorio Git.
- **--package-id**: El ID del paquete de tu aplicación, útil para la publicación.
- **--project-id**: El ID del proyecto.
- **--display-name**: El nombre que se mostrará para tu aplicación.

Estas opciones te permiten personalizar la creación de tu proyecto Ionic según tus necesidades específicas.

## 2. Visualización en navegador, Andriod e IOS

Claro, aquí tienes un resumen de cómo visualizar tu aplicación Ionic en el navegador y en las versiones de Android e iOS, incluyendo los pasos para instalar las herramientas necesarias.

### Visualizar en el Navegador

1. **Instalar Ionic CLI** (si no lo tienes instalado):
   ```bash
   npm install -g @ionic/cli
   ```

2. **Navegar al directorio de tu proyecto**:
   ```bash
   cd myApp
   ```

3. **Ejecutar el servidor de desarrollo**:
   ```bash
   ionic serve
   ```

4. **Abrir la aplicación en el navegador**:
   - La aplicación se abrirá automáticamente en tu navegador predeterminado.
   - Si no se abre automáticamente, accede a `http://localhost:8100` en tu navegador.

### Visualizar en Android e iOS

#### Instalaciones necesarias

1. **Instalar Capacitor CLI**:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```

2. **Instalar plataformas Android e iOS**:
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add android
   npx cap add ios
   ```

#### Sincronizar el proyecto

Cada vez que hagas cambios en tu código, sincroniza los cambios con las plataformas:
```bash
npx cap sync
```

#### Abrir la vista de Android

1. **Abrir el proyecto en Android Studio**:
   ```bash
   npx cap open android
   ```

2. **Ejecutar la aplicación en Android Studio**:
   - Selecciona un emulador o dispositivo físico.
   - Haz clic en el botón de "Run" (el icono de play) para compilar y ejecutar la aplicación.

#### Abrir la vista de iOS

1. **Abrir el proyecto en Xcode**:
   ```bash
   npx cap open ios
   ```

2. **Ejecutar la aplicación en Xcode**:
   - Selecciona un simulador o dispositivo físico.
   - Haz clic en el botón de "Run" (el icono de play) para compilar y ejecutar la aplicación.

### Requisitos adicionales

- **Android**: Instalar [Android Studio](https://developer.android.com/studio).
- **iOS**: Instalar [Xcode](https://developer.apple.com/xcode/) (solo en macOS).

### Resumen de comandos

```bash
# Instalar Ionic CLI
npm install -g @ionic/cli

# Navegar al directorio del proyecto
cd myApp

# Visualizar en el navegador
ionic serve

# Instalar Capacitor CLI
npm install @capacitor/core @capacitor/cli
npx cap init

# Añadir plataformas Android e iOS
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios

# Sincronizar el proyecto
npx cap sync

# Abrir la vista de Android
npx cap open android

# Abrir la vista de iOS
npx cap open ios
```

Estos pasos te permitirán visualizar tu aplicación Ionic tanto en el navegador como en las plataformas Android e iOS.

## 3. Estructuras, flujo y servicios

Claro, aquí tienes una descripción detallada de cada componente y estructura en Ionic, junto con ejemplos de código.

### 1. Componentes Básicos

#### Botones
Los botones son elementos interactivos que permiten a los usuarios realizar acciones.
```html
<ion-button>Default</ion-button>
<ion-button color="primary">Primary</ion-button>
<ion-button color="secondary">Secondary</ion-button>
<ion-button color="danger">Danger</ion-button>
```
- `color`: Define el color del botón. Las opciones incluyen `primary`, `secondary`, `danger`, etc.

#### Tarjetas
Las tarjetas son contenedores que agrupan información relacionada.
```html
<ion-card>
  <ion-card-header>
    <ion-card-title>Card Title</ion-card-title>
    <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
  </ion-card-header>
  <ion-card-content>
    This is some content inside a card.
  </ion-card-content>
</ion-card>
```
- `ion-card-header`: Contiene el título y subtítulo de la tarjeta.
- `ion-card-content`: Contiene el contenido principal de la tarjeta.

#### Listas
Las listas son colecciones de elementos que se pueden desplazar.
```html
<ion-list>
  <ion-item>
    <ion-label>Item 1</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Item 2</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Item 3</ion-label>
  </ion-item>
</ion-list>
```
- `ion-item`: Representa un elemento de la lista.
- `ion-label`: Etiqueta para el contenido del elemento.

#### Formularios
Los formularios permiten a los usuarios ingresar y enviar datos.
```html
<ion-item>
  <ion-label position="floating">Username</ion-label>
  <ion-input></ion-input>
</ion-item>
<ion-item>
  <ion-label position="floating">Password</ion-label>
  <ion-input type="password"></ion-input>
</ion-item>
<ion-button expand="full">Login</ion-button>
```
- `ion-label`: Etiqueta para el campo de entrada.
- `ion-input`: Campo de entrada de datos.
- `type`: Define el tipo de entrada, como `password` para contraseñas.
- `expand`: Define cómo se expande el botón, `full` lo hace ocupar todo el ancho.

### 2. Navegación

#### Rutas
Las rutas definen la navegación entre diferentes páginas de la aplicación.
Configura las rutas en `src/app/app-routing.module.ts`:
```typescript
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'details', loadChildren: () => import('./details/details.module').then(m => m.DetailsPageModule) }
];
```
- `path`: Define la URL de la ruta.
- `loadChildren`: Carga el módulo de la página de forma diferida.

#### Navegación Programática
Permite navegar entre páginas mediante código.
```typescript
import { NavController } from '@ionic/angular';

constructor(private navCtrl: NavController) {}

goToDetails() {
  this.navCtrl.navigateForward('/details');
}
```
- `navigateForward`: Navega hacia adelante a la ruta especificada.

### 3. Estructuras de Layout

#### Grid
El sistema de cuadrícula permite crear diseños responsivos.
```html
<ion-grid>
  <ion-row>
    <ion-col size="6">Column 1</ion-col>
    <ion-col size="6">Column 2</ion-col>
  </ion-row>
  <ion-row>
    <ion-col size="4">Column 1</ion-col>
    <ion-col size="4">Column 2</ion-col>
    <ion-col size="4">Column 3</ion-col>
  </ion-row>
</ion-grid>
```
- `ion-grid`: Contenedor de la cuadrícula.
- `ion-row`: Fila de la cuadrícula.
- `ion-col`: Columna de la cuadrícula.
- `size`: Define el tamaño de la columna.

#### Tabs
Las pestañas permiten navegar entre diferentes vistas.
```html
<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="home">
      <ion-icon name="home"></ion-icon>
      <ion-label>Home</ion-label>
    </ion-tab-button>
    <ion-tab-button tab="settings">
      <ion-icon name="settings"></ion-icon>
      <ion-label>Settings</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```
- `ion-tabs`: Contenedor de las pestañas.
- `ion-tab-bar`: Barra de pestañas.
- `slot`: Define la posición de la barra de pestañas.
- `ion-tab-button`: Botón de pestaña.
- `tab`: Identificador de la pestaña.
- `ion-icon`: Icono de la pestaña.
- `ion-label`: Etiqueta de la pestaña.

### 4. Servicios y Estado

#### Crear un Servicio
Los servicios permiten compartir datos y lógica entre componentes.
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data = [];

  constructor() {}

  getData() {
    return this.data;
  }

  addData(item) {
    this.data.push(item);
  }
}
```
- `@Injectable`: Decorador que marca la clase como un servicio inyectable.
- `providedIn: 'root'`: Hace que el servicio esté disponible en toda la aplicación.

#### Usar el Servicio en un Componente
```typescript
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  data = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.data = this.dataService.getData();
  }

  addItem() {
    this.dataService.addData('New Item');
  }
}
```
- `OnInit`: Interfaz que indica que el componente tiene un método `ngOnInit`.
- `ngOnInit`: Método que se ejecuta cuando el componente se inicializa.

### 5. Integración con Firebase

#### Autenticación
```typescript
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

constructor(private afAuth: AngularFireAuth) {}

login(email: string, password: string) {
  return this.afAuth.signInWithEmailAndPassword(email, password);
}

logout() {
  return this.afAuth.signOut();
}
```
- `AngularFireAuth`: Servicio de autenticación de Firebase.
- `signInWithEmailAndPassword`: Método para iniciar sesión con email y contraseña.
- `signOut`: Método para cerrar sesión.

#### Firestore
```typescript
import { AngularFirestore } from '@angular/fire/firestore';

constructor(private firestore: AngularFirestore) {}

getItems() {
  return this.firestore.collection('items').snapshotChanges();
}

addItem(item: any) {
  return this.firestore.collection('items').add(item);
}
```
- `AngularFirestore`: Servicio de Firestore de Firebase.
- `collection`: Método para acceder a una colección de Firestore.
- `snapshotChanges`: Método para obtener los cambios en tiempo real de una colección.
- `add`: Método para añadir un nuevo documento a una colección.

### 6. Plugins Nativos

#### Instalar Capacitor y Plugins
Capacitor permite acceder a funcionalidades nativas del dispositivo.
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```
- `@capacitor/core`: Núcleo de Capacitor.
- `@capacitor/cli`: Interfaz de línea de comandos de Capacitor.
- `cap init`: Inicializa un proyecto de Capacitor.
- `cap add android`: Añade la plataforma Android.
- `cap add ios`: Añade la plataforma iOS.

#### Usar Plugins
```typescript
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

async getCurrentPosition() {
  const position = await Geolocation.getCurrentPosition();
  console.log('Current position:', position);
}
```
- `Plugins`: Objeto que contiene todos los plugins de Capacitor.
- `Geolocation`: Plugin de geolocalización.
- `getCurrentPosition`: Método para obtener la posición actual del dispositivo.

### 7. Temas y Estilos

#### Variables de Tema
Define variables de tema para personalizar los colores de la aplicación.
En 

variables.scss

:
```scss
:root {
  --ion-color-primary: #3880ff;
  --ion-color-secondary: #0cd1e8;
  --ion-color-tertiary: #7044ff;
  --ion-color-success: #10dc60;
  --ion-color-warning: #ffce00;
  --ion-color-danger: #f04141;
  --ion-color-dark: #222428;
  --ion-color-medium: #989aa2;
  --ion-color-light: #f4f5f8;
}
```
- `:root`: Selector CSS que define variables globales.
- `--ion-color-primary`: Variable de color primario.

#### Estilos Globales
Define estilos globales para la aplicación.
En 

global.scss

:
```scss
body {
  font-family: 'Open Sans', sans-serif;
}
```
- `body`: Selector CSS para el cuerpo del documento.
- `font-family`: Propiedad CSS para definir la fuente.

### 8. Testing

#### Unit Testing
Pruebas unitarias para verificar la funcionalidad de los servicios y componentes.
```typescript
import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and retrieve data', () => {
    service.addData('Test Item');
    expect(service.getData()).toContain('Test Item');
  });
});
```
- `TestBed`: Utilidad para configurar y crear un entorno de prueba.
- `describe`: Define un conjunto de pruebas.
- `it`: Define una prueba individual.
- `expect`: Aserción para verificar el resultado de una prueba.

#### E2E Testing
Pruebas end-to-end para verificar la funcionalidad completa de la aplicación.
```typescript
import { browser, by, element } from 'protractor';

describe('Home Page', () => {
  it('should display welcome message', () => {
    browser.get('/');
    expect(element(by.css('app-home h1')).getText()).toEqual('Welcome to Ionic');
  });
});
```
- `browser`: Objeto para interactuar con el navegador.
- `by`: Utilidad para seleccionar elementos.
- `element`: Selecciona un elemento del DOM.
- `getText`: Obtiene el texto de un elemento.

### Recursos Adicionales
- [Documentación de Ionic](https://ionicframework.com/docs)
- [Componentes de Ionic](https://ionicframework.com/docs/components)
- [Temas y Estilos en Ionic](https://ionicframework.com/docs/theming/basics)
- [Capacitor Plugins](https://capacitorjs.com/docs/apis)

Esta guía te proporciona una base sólida para desarrollar tu aplicación con Ionic, añadiendo componentes y estructuras según tus necesidades.

Similar code found with 3 license types