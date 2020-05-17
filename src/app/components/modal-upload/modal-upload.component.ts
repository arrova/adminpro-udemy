import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
  ],
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(
    public _sas: SubirArchivoService,
    public _mus: ModalUploadService
  ) {
    console.log('Modal listo');
  }

  seleccionImage( archivo: File ){
    if( !archivo ){
      this.imagenSubir = null;
      return;
    }

    if( archivo.type.indexOf('image') < 0  ){
      Swal.fire({
        title: 'Solo imagenes',
        text: 'El archivo seleccionado no es una imagen',
        icon: 'error'
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  subirImagen(){
    this._sas.subirArchivo( this.imagenSubir, this._mus.tipo, this._mus.id )
    .then( (resp) => {
      this._mus.notificacion.emit( resp );
      //this._mus.ocultarModal();
      this.cerrarModal();
    })
    .catch( (err) => {
      console.log('Error en la carga...');
    });
  }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._mus.ocultarModal();
  }

}
