import { NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EditorsComponent } from '../utils/editors/editors.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TwNestedNodesComponent } from '../utils/tw-nested-nodes/tw-nested-nodes.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { ArbolService } from '../services/arbol.service';
import { ArticuloService } from '../services/articulo.service';

export interface PeriodicElement {
  taskName: string;
  taskID: string;
  assignedTo: string;
  dueDate: string;
  priority: string;
  status: any;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    taskID: '#951',
    taskName: 'Hotel management system',
    assignedTo: 'Shawn Kennedy',
    dueDate: '15 Nov, 2024',
    priority: 'High',
    status: {
      inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#587',
    taskName: 'Send proposal to APR Ltd',
    assignedTo: 'Roberto Cruz',
    dueDate: '14 Nov, 2024',
    priority: 'Medium',
    status: {
      // inProgress: 'In Progress',
      pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#618',
    taskName: 'Python upgrade',
    assignedTo: 'Juli Johnson',
    dueDate: '13 Nov, 2024',
    priority: 'High',
    status: {
      // inProgress: 'In Progress',
      // pending: 'Pending',
      completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#367',
    taskName: 'Schedule meeting with Daxa',
    assignedTo: 'Catalina Engles',
    dueDate: '12 Nov, 2024',
    priority: 'Low',
    status: {
      // inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#761',
    taskName: 'Engineering lite touch',
    assignedTo: 'Louis Nagle',
    dueDate: '11 Nov, 2024',
    priority: 'Medium',
    status: {
      inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#431',
    taskName: 'Refund bill payment',
    assignedTo: 'Michael Marquez',
    dueDate: '10 Nov, 2024',
    priority: 'Low',
    status: {
      // inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#421',
    taskName: 'Public beta release',
    assignedTo: 'James Andy',
    dueDate: '09 Nov, 2024',
    priority: 'High',
    status: {
      inProgress: 'In Progress',
      // pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#624',
    taskName: 'Fix platform errors',
    assignedTo: 'Alina Smith',
    dueDate: '08 Nov, 2024',
    priority: 'Medium',
    status: {
      // inProgress: 'In Progress',
      // pending: 'Pending',
      completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  },
  {
    taskID: '#513',
    taskName: 'Launch our mobile app',
    assignedTo: 'David Warner',
    dueDate: '07 Nov, 2024',
    priority: 'Low',
    status: {
      // inProgress: 'In Progress',
      pending: 'Pending',
      // completed: 'Completed',
      // notStarted: 'Not Started',
    },
    action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete'
    }
  }
];

interface Node {
  id?: string;
  name: string;
  content?: string;
  state?: string;
  children?: Node[];
  isVisible?: boolean;
  isExpanded?: boolean;
}

interface CategoriaNode {
  nombre: string;
  children?: CategoriaNode[];
}

@Component({
  selector: 'app-lista-articulos',
  standalone: true,
  imports: [
    MatCardModule, MatMenuModule, MatButtonModule, RouterLink, MatTableModule, NgIf, MatCheckboxModule,
    MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatPaginatorModule,
    RouterLinkActive, MatProgressBarModule, EditorsComponent, MatDialogModule, TwNestedNodesComponent, ReactiveFormsModule, MatTreeModule
  ],
  templateUrl: './lista-articulos.component.html',
  styleUrl: './lista-articulos.component.scss'
})
export class ListaArticulosComponent {

  private fb = inject(FormBuilder);

  displayedColumns: string[] = ['titulo', 'contenido', 'codigo', 'action'];
  dataSource = new MatTableDataSource<Node>();
  selection = new SelectionModel<Node>(true, []);

  treeControl = new NestedTreeControl<CategoriaNode>((node) => node.children);
  dataSource1 = new MatTreeNestedDataSource<CategoriaNode>();
  addNodeForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // isToggled
  isToggled = false;

  //form!: FormGroup;

  // Popup Trigger
  classApplied = false;
  toggleClass() {
    this.classApplied = !this.classApplied;
  }




  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  constructor(
    public themeService: CustomizerSettingsService,
    public arbolService: ArbolService,
    public articuloService: ArticuloService
  ) {
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }



  ngOnInit(): void {
    /* this.form = this.fb.group({
      titulo: [null, [Validators.required]],
      contenido: [null, [Validators.required]],
      estado: [null, [Validators.required]],
    }); */
    //this.dataSource.data
    this.articuloService.getArticulos(0, 10).subscribe({
      next: (data:any) => {
        console.log(data);
        this.dataSource.data = data.content;
      },
      error: (err) => { console.log("Error al cargar los Artículos") }
    }
    );

    this.dataSource1.data = [
      {
        nombre: 'Tecnología',
        children: [
          {
            nombre: 'Programación',
            children: [{ nombre: 'Bases de Datos', children: [] }],
          },
        ],
      },
    ];

    this.addNodeForm = this.fb.group({
      nombre: '',
      padre: '',
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  guardar() {
    /* console.log(this.form.value);
    console.log(this.form); */
  }


  hasChild = (_: number, node: CategoriaNode) =>
    !!node.children && node.children.length > 0;





}
