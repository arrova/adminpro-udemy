import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService } from '../../services/service.index';
import { HospitalService } from '../../services/service.index';
import { Medico } from 'src/app/models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ],
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public _ms: MedicoService,
    public _hs: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _mus: ModalUploadService
  ) {
    activatedRoute.params.subscribe( params => {
      let id = params['id'];

      if(id !== 'nuevo'){
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit(): void {
    this._hs.cargarHospitales(0, 100)
      .subscribe((resp: any) => this.hospitales = resp.hospitales);
    this._mus.notificacion
      .subscribe( resp => {
        this.medico.img = resp.medico.img;
      });
  }

  guardarMedico( forma: NgForm ){
    if( forma.invalid ){
      return;
    }
    this._ms.guardarMedico( this.medico )
    .subscribe( medico => {
      this.medico = medico;
      this.router.navigate(['/medico', medico._id]);
    });
  }

  cambioHospital( id: string ){
    console.log(id);
    this._hs.obtenerHospital( id )
      .subscribe( hospital => this.hospital = hospital );
  }

  cargarMedico( id: string ){
    this._ms.obtenerMedico(id)
    .subscribe( medico => {
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      this.cambioHospital( this.medico.hospital );
    });
  }

  cambiarFoto(){
    this._mus.mostrarModal('medicos', this.medico._id);
  }

}
