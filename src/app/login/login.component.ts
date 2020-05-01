import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ],
})
export class LoginComponent implements OnInit {

  correo: string;
  recuerdame = false;
  auth2: any;

  constructor(
    public router: Router,
    public _us: UsuarioService
    ) { }

  ngOnInit(): void {
    init_plugins();
    this.googleInit();
    this.correo = localStorage.getItem('correo') || '';
    if(this.correo.length  > 1){
      this.recuerdame = true;
    }
  }

  googleInit(){
    gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '51558327016-o31nn47ea0jvbhpj9gsnril9kvkjc20o.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.attachSignin( document.getElementById('btnGoogle') );
    });
  }

  attachSignin( element ){
    this.auth2.attachClickHandler( element, {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile();
      // console.log(profile);
      const TOKEN = googleUser.getAuthResponse().id_token;
      this._us.loginGoogle( TOKEN )
        .subscribe( () => window.location.href = '#/dashboard');
    });
  }

  ingresar( forma: NgForm ){
    if( forma.invalid ){
      return;
    }

    const usuario = new Usuario(null, forma.value.correo, forma.value.password);
    this._us.login( usuario, forma.value.recuerdame )
      .subscribe( correcto => this.router.navigate(['/dashboard']));
    // console.log( forma.valid );
    // console.log( forma.value );
    // this.router.navigate([ '/dashboard' ]);
  }

}
