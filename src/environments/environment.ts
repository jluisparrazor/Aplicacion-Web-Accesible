// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Variables en entorno de desarrollo
export const environment = {
  production: false,

  //Configuración de firebase 
  firebase: {
  apiKey: "AIzaSyC1PrvP7l_0w1Z2krGwilRqLlAvCAhNAVs",
  authDomain: "app-prueba-4ce18.firebaseapp.com",
  projectId: "app-prueba-4ce18",
  storageBucket: "app-prueba-4ce18.appspot.com",
  messagingSenderId: "927492475304",
  appId: "1:927492475304:web:6bac229ac274737c04f59d",
  measurementId: "G-E18NS9KM1Z"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
