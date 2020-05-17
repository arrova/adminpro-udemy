import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from 'src/app/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos = 0;

  constructor(
    public http: HttpClient,
    public _us: UsuarioService
  ) { }

  cargarMedicos( desde: number = 0 ){
    const url = `${URL_SERVICIOS}/medico?desde=${desde}`;
    return this.http.get( url )
    .pipe(
      map( (resp: any) => {
        console.log(resp);
        this.totalMedicos = resp.total;
        return resp.medicos;
      })
    );
 }

  obtenerMedico( id: string ){
    const url = `${URL_SERVICIOS}/medico/${id}`;
    return this.http.get( url )
    .pipe(
      map( (resp: any) => resp.medico )
    );
  }

 buscarMedicos( termino: string ){
  const url = `${URL_SERVICIOS}/busqueda/coleccion/medico/${termino}`;
  return this.http.get( url )
  .pipe(
    map( (resp: any) => resp.medico )
  );
 }

 borrarMedico( id: string ){
  let url = `${URL_SERVICIOS}/medico/${id}`;
  url += `?token=${this._us.token}`;
  return this.http.delete( url )
    .pipe(
      map( resp => {
        Swal.fire(
          'Borrado!',
          'Médico borrado correctamente.',
          'success'
        );
        return true;
      })
    );
 }

 guardarMedico( medico: Medico ){
  let url = `${URL_SERVICIOS}/medico`;

  if( medico._id ){
    url += `/${medico._id}?token=${this._us.token}`;
    return this.http.put( url, medico )
    .pipe(
      map( (resp: any) => {
        Swal.fire({
          title: 'Medico Actualizado',
          html: `Medico ${medico.nombre} modificado correctametne`,
          icon: 'success'
        });
        return resp.medico;
      })
    );
  }else{
    url += `?token=${this._us.token}`;
    return this.http.post( url, medico )
      .pipe(
        map( (resp: any) => {
          const medico = resp.medico;
          let timerInterval;
          Swal.fire({
            title: `Medico ${medico.nombre} creado correctamente`,
            html: 'Se cerrara en <b></b> segundos.',
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
            onBeforeOpen: () => {
              Swal.showLoading();
              timerInterval = setInterval(() => {
                const content = Swal.getContent();
                if (content) {
                  const b = content.querySelector('b');
                  if (b) {
                    b.textContent = (Swal.getTimerLeft() / 1000).toFixed(1);
                  }
                }
              }, 100);
            },
            onClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            /*if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer');
            }*/
          });
          return medico;
        })
      );
  }

 }
}
