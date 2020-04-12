import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: [
  ],
})
export class ProgressComponent implements OnInit {

  porcentaje1 = 20;
  porcentaje2 = 30;

  constructor() { }

  ngOnInit(): void {
  }

  // actualizar( event: number ){
  //   console.log('Evento: ', event);
  // }

  // cambiarValor( valor: number ) {
  //   if ( this.porcentaje >= 100 && valor > 0) {
  //     this.porcentaje = 100;
  //     return;
  //   }
  //   if (this.porcentaje <= 0 && valor < 0) {
  //     this.porcentaje = 0;
  //     return;
  //   }
  //   this.porcentaje = this.porcentaje + valor;
  // }

}
