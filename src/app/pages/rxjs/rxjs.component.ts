import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ],
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    // El observable tiene tres callbacks
    // El pipe contiene el retry que nos servira para recuperar lo que estabamos haciendo si hubo algun fallo 
    this.subscription = this.regresaObservable()
    // .pipe(
    //   // El numero que se le envía es el número de intentos que deseamos hacer, hace el primero normal,
    //   // luego hace un tercero que es con el que terminay sigue el flujo normal
    //   retry(2)
    // )
    .subscribe(
      // Primer callback
      numero => console.log('Subs ', numero),
      // El segundo es un error
      error => console.error('Error en el obs', error),
      // El ultimo no recibe ningun objeto y esta se corre cuando se termina
      () => console.log('El observador termino!')
      );
  }

  ngOnInit(): void {
  }

  // Esta función se corre antes de dejar la página
  ngOnDestroy(): void {
    console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( (observer: Subscriber<any>) => {
      let contador = 0;
      let intervalo = setInterval( () => {
        contador ++;

        const salida = {
          valor: contador
        };
        observer.next( salida );
        // if(contador ===3){
        //   clearInterval(intervalo);
        //   observer.complete();
        // }
        // Para mandar un error y se sale del código
        // Como el proceso sigue, se aumenta a 3, por que hace un retry y ya no se lanza el error
        // if(contador === 2){
        //   // clearInterval(intervalo);
        //   observer.error('Auxilio!');
        // }
      }, 1000);
    }).pipe(
      // Se pueden poner miles de operadores en esta parte
      map( resp => resp.valor),
      // Valor es del balor que nos regresa el map y el index es las veces que ha pasado por la función filter
      filter( ( valor, index ) =>{
        // console.log('Filter ', valor, index);
        // Esta función regresa un true o un false, para filtrar cuales si debe dejar pasar y cuales no
        if( ( valor % 2 ) === 1 ){
          // impar
          return true;
        }else{
          // par
          return false;
        }
      })
      );
  }

}
