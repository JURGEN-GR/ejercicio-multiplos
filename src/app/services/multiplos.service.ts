import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from '@firebase/firestore';
import { Multiplos } from '../app.component';

@Injectable({
  providedIn: 'root',
})
export class MultiplosService {
  constructor(private firestore: Firestore) {}

  guardarDataDB(numeroIngresado: number, multiplos: Multiplos) {
    // eliminar arreglos vacios
    if (multiplos.de3?.length === 0) delete multiplos.de3;
    if (multiplos.de5?.length === 0) delete multiplos.de5;
    if (multiplos.de7?.length === 0) delete multiplos.de7;

    // Guardar en la base de datos
    const multiplosRef = collection(this.firestore, 'multiplos');
    return addDoc(multiplosRef, { numeroIngresado, multiplos });
  }
}
