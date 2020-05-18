import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = {};

  constructor(
    public http: HttpClient,
    public router: Router,
    public _sas: SubirArchivoService
    ) {
    this.cargarStorage();
   }

   renuevaToken(){
    const url = `${URL_SERVICIOS}/login/renuevaToken?token=${this.token}`;
    return this.http.get( url )
    .pipe(
      map( (resp: any) => {
        this.token = resp.token;
        localStorage.removeItem('token');
        localStorage.setItem('token', this.token );
        console.log('Token renoavado');
        return true;
      }),
      catchError( (err: any) => {
        this.router.navigate(['/login']);
        Swal.fire({
          title: 'No se pudo renovar token',
          html: 'No fue posible renovar token',
          icon: 'error'
        });
        return throwError(err);
      })
    );
   }

   estaLogueado(){
     return ( this.token.length > 5 ) ? true : false;
   }

   logout(){
     this.usuario = null;
     this.token = '';
     this.menu = {};
     localStorage.removeItem('id');
     localStorage.removeItem('token');
     localStorage.removeItem('usuario');
     localStorage.removeItem('menu');
     this.router.navigate(['/login']);
   }

   cargarStorage(){
     if( localStorage.getItem('token') ){
       this.token = localStorage.getItem('token');
       this.usuario = JSON.parse(localStorage.getItem('usuario'));
       this.menu = JSON.parse(localStorage.getItem('menu'));
     }else{
      this.token = '';
      this.usuario = null;
      this.menu = {};
     }
   }

   guardarStorage( id: string, token: string, usuario: Usuario, menu: any ){
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
   }

   loginGoogle( token: string ){
    const url = `${URL_SERVICIOS }/login/google`;
    return this.http.post( url, { token } )
      .pipe(
        map( (resp: any) => {
          console.log(resp);
          this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
          return true;
        })
      );
   }


   login( usuario: Usuario, recordar: boolean = false ){

    if ( recordar ){
      localStorage.setItem('correo', usuario.correo);
    }else{
      localStorage.removeItem('correo');
    }

    const url = `${URL_SERVICIOS }/login`;
    return this.http.post( url, usuario )
      .pipe(
        map( (resp: any) => {
          // localStorage.setItem('id', resp.id );
          // localStorage.setItem('token', resp.token );
          // localStorage.setItem('usuario', JSON.stringify(resp.usuario));
          console.log(resp);
          this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        }),

        catchError( (err: any) => {
          console.log('dasdasdasd', err.status);
          Swal.fire({
            title: 'Error en el login',
            html: err.error.mensaje,
            icon: 'error'
          });
          return throwError(err);
        })
      );
   }

   crearUsuario( usuario: Usuario ){
     const url = `${URL_SERVICIOS }/usuario`;
     return this.http.post( url, usuario )
       .pipe(
         map( (resp: any) => {
          Swal.fire({
            title: 'Usuario creado',
            text: usuario.correo,
            icon: 'success'
          });
         }),
         catchError( (err: any) => {
          Swal.fire({
            title: err.error.mensaje,
            html: err.error.errors.message,
            icon: 'error'
          });
          return throwError(err);
        })
       );
   }

   actualizarUsuario(usuario: Usuario){
    const url = `${URL_SERVICIOS }/usuario/${ usuario._id }?token=${ this.token }`;
    return this.http.put( url, usuario )
      .pipe(
        map( (resp: any) => {

          if( usuario._id === this.usuario._id ){
            let usuarioDB: Usuario = resp.usuario;
            this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );
          }

          Swal.fire({
            title: 'Usuario actualizado',
            text: usuario.nombre,
            icon: 'success'
          });
          return true;
        }),
        catchError( (err: any) => {
         Swal.fire({
           title: err.error.mensaje,
           html: err.error.errors.message,
           icon: 'error'
         });
         return throwError(err);
       })
      );
   }

   cambiarImagen( archivo: File, id: string ){
    this._sas.subirArchivo( archivo, 'usuarios', id )
      .then( (resp: any) =>{
        this.usuario.img = resp.usuario.img;
        Swal.fire({
          title: 'Imagen actualizado',
          text: this.usuario.nombre,
          icon: 'success'
        });
        this.guardarStorage(id, this.token, this.usuario, this.menu);
      })
      .catch( resp =>{
        console.log(resp);
      })
   }

   cargarUsuarios( desde: number = 0 ){
      const url = `${URL_SERVICIOS}/usuario?desde=${desde}`;
      return this.http.get( url );
   }

   buscarUsuario( termino: string ){
    const url = `${URL_SERVICIOS}/busqueda/coleccion/usuario/${termino}`;
    return this.http.get( url )
    .pipe(
      map( (resp: any) => resp.usuario )
    );
   }

   borrarUsuario( id: string ){
    let url = `${URL_SERVICIOS}/usuario/${id}`;
    url += `?token=${this.token}`;
    return this.http.delete( url )
      .pipe(
        map( resp => {
          Swal.fire(
            'Borrado!',
            'Usuario borrado correctamente.',
            'success'
          );
          return true;
        })
      );
   }
}
