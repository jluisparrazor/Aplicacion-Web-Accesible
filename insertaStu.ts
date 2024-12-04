// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig= {
  apiKey: "AIzaSyC1PrvP7l_0w1Z2krGwilRqLlAvCAhNAVs",
  authDomain: "app-prueba-4ce18.firebaseapp.com",
  projectId: "app-prueba-4ce18",
  storageBucket: "app-prueba-4ce18.appspot.com",
  messagingSenderId: "927492475304",
  appId: "1:927492475304:web:6bac229ac274737c04f59d",
  measurementId: "G-E18NS9KM1Z"
  };

// Inicializa la app de Firebase y la base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function insertStudents() {
  const students = [
    {
      id: "1",
      name: "Juan",
      surname: "Ramirez",
      dni: "12345",
      pictogramId: null,
      phone: "555-1234",
      personalData: "Ejemplo de datos personales",
      birthDate: new Date("2000-01-01"),
      profileType: true,
      loginType: false,
      disabilities: {
        visual: false,
        auditory: true,
        motor: false,
        cognitive: false,
      },
    },
    {
      id: "2",
      name: "Maria",
      surname: "Lopez",
      dni: "54321",
      pictogramId: "picto_123",
      phone: "555-5678",
      personalData: "Información adicional",
      birthDate: new Date("1998-05-15"),
      profileType: false,
      loginType: true,
      disabilities: {
        visual: true,
        auditory: false,
        motor: false,
        cognitive: true,
      },
    },
    {
      id: "03675836-267b-4fbc-9b45-78ff79333eab",
      name: "Pedro",
      surname: "Suárez",
      dni: "142567982A",
      pictogramId: "2642",
      phone: 124365789,
      personalData: null,
      birthDate:null, 
      profileType: true,
      loginType: false,
      disabilities: {
        visual: false,
        auditory: false,
        motor: true,
        cognitive: true,
      },
      correctPassword:[1,2,3],
    },
  ];

  // Inserta cada estudiante en la colección "Students"
  for (const student of students) {
    try {
      const docRef = await addDoc(collection(db, "Students"), student);
      console.log("Documento agregado con ID: ", docRef.id);
    } catch (e) {
      console.error("Error al agregar el documento: ", e);
    }
  }
}

// Llama a la función para insertar los datos
insertStudents();
