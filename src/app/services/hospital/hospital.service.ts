import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospital: Hospital;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _sas: SubirArchivoService,
    public _us: UsuarioService
  ) {
  }

  cargarHospitales( desde: number = 0, limite: number = 5 ){
    const url = `${URL_SERVICIOS}/hospital?desde=${desde}&limite=${limite}`;
    return this.http.get( url );
 }

 obtenerHospital( id: string ){
  const url = `${URL_SERVICIOS}/hospital/${id}`;
  return this.http.get( url )
  .pipe(
    map( (resp: any) => resp.hospital )
  );
}

 buscarHospital( termino: string ){
  const url = `${URL_SERVICIOS}/busqueda/coleccion/hospital/${termino}`;
  return this.http.get( url )
  .pipe(
    map( (resp: any) => resp.hospital )
  );
 }

 crearHospital(nombre: string){
  const url = `${URL_SERVICIOS}/hospital?token=${ this._us.token }`;
  this.hospital = new Hospital(nombre);
  return this.http.post( url, this.hospital )
  .pipe(
    map( (resp: any) => {
      const hospital = resp.hospital;
      let timerInterval;
      Swal.fire({
        title: `Hotel ${hospital.nombre} creado correctamente`,
        html: 'Se cerrara en <b></b> segundos.',
        icon: 'success',
        timer: 3500,
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
    })
  );
 }

 actualizarHospital(hospital: Hospital){
  const url = `${URL_SERVICIOS }/hospital/${ hospital._id }?token=${ this._us.token }`;
  return this.http.put( url, hospital )
    .pipe(
      map( (resp: any) => {
        Swal.fire({
          title: 'Hospital actualizado',
          text: hospital.nombre,
          icon: 'success'
        });
        return true;
      })
    );
 }

 borrarHospital( id: string ){
  let url = `${URL_SERVICIOS}/hospital/${id}`;
  url += `?token=${this._us.token}`;
  return this.http.delete( url )
    .pipe(
      map( resp => {
        Swal.fire(
          'Borrado!',
          'Hospital borrado correctamente.',
          'success'
        );
        return true;
      })
    );
 }

}
