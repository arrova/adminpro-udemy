import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ],
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde = 0;
  cargando = true;

  constructor(
    public _ms: MedicoService,
    public _mus: ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this._mus.notificacion
      .subscribe( resp =>  this.cargarMedicos() );
  }

  cargarMedicos(){
    this.cargando = true;
    this._ms.cargarMedicos( this.desde )
      .subscribe( medicos => {
        this.medicos = medicos;
        this.cargando = false;
      });
  }

  cambiarDesde( valor: number ){
    const desde = this.desde + valor;

    if ( desde >= this._ms.totalMedicos ){
      return;
    }

    if ( desde < 0 ){
      return;
    }
    this.desde += valor;
    this.cargarMedicos();
  }

  buscarMedico( termino: string ){
    if( termino.length <= 0 ){
      this.cargarMedicos();
      return;
    }
    this.cargando = true;
    this._ms.buscarMedicos(termino)
      .subscribe( ( medicos: Medico[]) => {
        this.medicos = medicos;
        this.cargando = false;
      });
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar el médico ' + medico.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!'
    }).then((borrar) => {
      if (borrar.value) {
        this._ms.borrarMedico(medico._id)
          .subscribe( resp => {
            this.cargarMedicos();
          });
      }
    });
  }

  mostrarModal( id: string ){
    this._mus.mostrarModal( 'medicos', id );
  }

}
