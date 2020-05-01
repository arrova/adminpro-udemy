import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor( 
    public _us: UsuarioService,
    public router: Router
    ){}

  canActivate(){
    if( this._us.estaLogueado() ){
      console.log('Paso el guard');
      return true;
    }
    console.log('Bloqueado por el guard');
    this.router.navigate(['/login']);
    return false;
  }
}
