import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Validators } from 'ngx-editor';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { UsuariosService } from '../services/usuarios.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatCardModule, MatStepperModule, FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginator,
    MatIconModule,
    MatTableModule,
    MatSelectModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  @ViewChild('stepper') stepper: MatStepper;

  firstFormGroup = this._formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
  });
  
  segundoFormGroup = this._formBuilder.group({
  });

  dataSource: any = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nombre', 'apellido','usuario','accion'];

  clickedRows = new Set<any>();

  usuarioSeleccionado:any;

  constructor(
    public themeService: CustomizerSettingsService,
    private _formBuilder: FormBuilder,
    private usuariosService:UsuariosService

  ) {

  }

  onInit() {
    this.dataSource.data = [];
  }

  ngAfterViewInit() {
    //Paginar
    this.dataSource.paginator;
  }


  buscarUsuario(){
    console.log(this.firstFormGroup.value);
    if (this.firstFormGroup.value?.apellido) {
      this.usuariosService.getUsuarioApellido(this.firstFormGroup.value?.apellido.toString()).subscribe({
        next:((resp:any)=>{
          console.log(resp);
          this.dataSource.data= resp;
        }),
        error:((err:any)=>{
          console.warn(err);
        })
      })
    }else if (this.firstFormGroup.value?.nombre) {

    }else{
      console.log("Ingrese valor Apellido o nombre");
    }
  }


  clickedRowFn(row: any) {
    console.log(row);
    if (this.clickedRows.has(row)) {
      this.resetDatos();
      this.clickedRows.delete(row);
    } else {
      this.clickedRows.clear();
      this.resetDatos();
      this.clickedRows.add(row);
      //this.datos(row);
    }
  }

  resetDatos() {
    //this.usuariosSelecionado = null;
    //this.secondFormGroup.reset();
  }

  secondStep(element:any){
    console.log(element);
    this.stepper.selectedIndex = 1;
    this.usuarioSeleccionado=element;
  }





}
