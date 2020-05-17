import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ],
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;

  constructor(
    public _hs: HospitalService,
    public _mus: ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this._mus.notificacion
      .subscribe( resp =>  this.cargarHospitales() );
  }

  cargarHospitales(){
    this.cargando = true;
    this._hs.cargarHospitales(this.desde)
    .subscribe( (resp: any) => {
      this.hospitales = resp.hospitales;
      this.totalRegistros = resp.total;
      this.cargando = false;
    });
  }

  buscarHospital( termino: string ){
    if( termino.length <= 0 ){
      this.cargarHospitales();
      return;
    }
    this.cargando = true;
    this._hs.buscarHospital(termino)
      .subscribe( ( hospitales: Hospital[]) => {
        this.hospitales = hospitales;
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
    this.cargarHospitales();
  }

  borrarHospital(hospital: Hospital) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar al hospital ' + hospital.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!'
    }).then((borrar) => {
      if (borrar.value) {
        this._hs.borrarHospital(hospital._id)
          .subscribe( resp => {
            this.cargarHospitales();
          });
      }
    });
  }

  guardarHospital(hospital: Hospital){

    if(hospital.nombre === undefined || hospital.nombre.trim() === ''){
      return;
    }
    this._hs.actualizarHospital( hospital )
    .subscribe();
  }

  mostrarModal( id: string ){
    this._mus.mostrarModal( 'hospitales', id );
  }

  crearHospital(){
    Swal.fire({
      title: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      icon: 'info',
      inputValue: '',
      inputPlaceholder: 'Nombre del Hotel',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value.length === 0 ) {
          return 'Necesitas ingrear un nombre';
        }
        this._hs.crearHospital(value).subscribe( resp => this.cargarHospitales());
      }
    });
  }

}
