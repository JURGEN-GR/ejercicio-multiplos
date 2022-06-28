import { Component, ElementRef, ViewChild } from '@angular/core';
import { MultiplosService } from './services/multiplos.service';

export interface Multiplos {
  de3?: number[];
  de5?: number[];
  de7?: number[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // Crear referencia al contenedor de alertas
  @ViewChild('contenedorAlertas')
  contenedorAlertas!: ElementRef<HTMLDivElement>;
  // Crear referencia al input hmtl
  @ViewChild('inputText') inputText!: ElementRef<HTMLInputElement>;

  // Propiedad global que contiene el numero que igreso el usuario
  public numeroIngresado: number = 0;

  // Propiedad global que contiene todos los multiplos
  public multiplos: Multiplos = {
    de3: [],
    de5: [],
    de7: [],
  };

  constructor(private multiplosService: MultiplosService) {}

  mostrarAlerta(mensaje: string, tipo: string) {
    // Con la referencia del div, se inserta la alerta y la muestra
    this.contenedorAlertas.nativeElement.innerHTML = `
      <div class="alert mt-3 fadeIn ${tipo}">
        <strong>Atención!</strong>
        <p>${mensaje}</p>
      </div>
    `;
  }

  guardarNumero() {
    // verificar que el input no este vacio
    if (this.inputText.nativeElement.value.length === 0) return;

    // combertir el texto a numero
    const numero = Number(this.inputText.nativeElement.value);

    // asignar el numero a la propiedad global
    this.numeroIngresado = numero;

    // Limpiar el input
    this.inputText.nativeElement.value = '';
  }

  // Funcion que se ejecuta al hacer click en el boton o al presionar enter
  calcular() {
    this.guardarNumero();
    // Validar que el numero ingresado no sea negativo
    if (this.numeroIngresado < 0) {
      this.mostrarAlerta(
        'El numero ingresado no puede ser negativo.',
        'alert-warning'
      );
      return;
    }

    // Limpiar el arreglo de multiplos
    this.multiplos.de3 = [];
    this.multiplos.de5 = [];
    this.multiplos.de7 = [];

    // Se multiplica el numero iterado por el multiplo y si es igual al numero ingresado
    //  se agrega al arreglo
    for (let i = 1; i < this.numeroIngresado; i++) {
      if (i * 3 === this.numeroIngresado) this.multiplos.de3.push(i);
      if (i * 5 === this.numeroIngresado) this.multiplos.de5.push(i);
      if (i * 7 === this.numeroIngresado) this.multiplos.de7.push(i);
    }

    // Validar que haya al menos un multiplo antes de guardar en la base de datos
    if (
      this.multiplos.de3.length === 0 &&
      this.multiplos.de5.length === 0 &&
      this.multiplos.de7.length === 0
    ) {
      this.mostrarAlerta(
        'El numero ingresado no tiene multiplos.',
        'alert-warning'
      );
      return;
    }

    // Guardar los multiplos en la base de datos
    this.multiplosService
      .guardarDataDB(this.numeroIngresado, {
        ...this.multiplos,
      })
      .then((resp) => {
        this.mostrarAlerta('Datos guardados correctamente.', 'alert-success');
      })
      .catch((err) => {
        this.mostrarAlerta('Error al guardar los datos.', 'alert-danger');
      });
  }
}
