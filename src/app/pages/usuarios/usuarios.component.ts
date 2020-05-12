import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;

  constructor(
    public _us: UsuarioService,
    public _mus: ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this._mus.notificacion
      .subscribe( resp =>  this.cargarUsuarios() );
  }
  cargarUsuarios(){
    this.cargando = true;
    this._us.cargarUsuarios(this.desde)
    .subscribe( (resp: any) => {
      this.usuarios = resp.usuarios;
      this.totalRegistros = resp.total;
      this.cargando = false;
    });
  }

  cambiarDesde( valor: number ){
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistros ){
      return;
    }

    if ( desde < 0 ){
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ){
    console.log(termino);
    if( termino.length <= 0 ){
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this._us.buscarUsuario(termino)
      .subscribe( (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if ( usuario._id === this._us.usuario._id ) {
      Swal.fire({
        title: 'No se puede borrar usuario',
        text: 'No se puede borrar a si mismo',
        icon: 'error'
      });
      return;
    }
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!'
    }).then((borrar) => {
      if (borrar.value) {
        this._us.borrarUsuario(usuario._id)
          .subscribe( resp => {
            this.cargarUsuarios();
          });
      }
    });
  }

  guardarUsuario(usuario: Usuario){
    this._us.actualizarUsuario( usuario )
    .subscribe();
  }

  mostrarModal( id: string ){
    this._mus.mostrarModal( 'usuarios', id );
  }

}
