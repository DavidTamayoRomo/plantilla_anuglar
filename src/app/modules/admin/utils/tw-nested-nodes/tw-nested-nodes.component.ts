import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomizerSettingsService } from '../../../../common/customizer-settings/customizer-settings.service';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Validators } from 'ngx-editor';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EditorsComponent } from '../editors/editors.component';
import { HasRoleDirective } from '../../../../directives/has-role.directive';
import { ArticuloService } from '../../services/articulo.service';

interface Node {
    id?: string;
    name: string;
    content?: string;
    state?: string;
    referencia?: string;
    id_padre?: string;
    children?: Node[];
    isVisible?: boolean;
    isExpanded?: boolean;
}



@Component({
    selector: 'app-tw-nested-nodes',
    standalone: true,
    imports: [MatTreeModule, MatButtonModule, MatIconModule, FormsModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, EditorsComponent, HasRoleDirective],
    templateUrl: './tw-nested-nodes.component.html',
    styleUrl: './tw-nested-nodes.component.scss'
})
export class TwNestedNodesComponent {
    @Output() NodoSeleccionado = new EventEmitter<Node[]>();

    // Añade un BehaviorSubject para manejar los datos del árbol
    private dataChange = new BehaviorSubject<Node[]>([]);

    treeControl = new NestedTreeControl<Node>(node => node.children);
    dataSource = new MatTreeNestedDataSource<Node>();
    searchText = '';

    classApplied = false;
    datoSeleccionado: any;
    datoSeleccionadoGuardar: any;
    content: any;

    banderaPadre = false;

    form!: FormGroup;
    private fb = inject(FormBuilder);
    constructor(
        public themeService: CustomizerSettingsService,
        public articuloService: ArticuloService
    ) {

    }

    ngOnInit(): void {
        this.form = this.fb.group({
            titulo: [null, [Validators.required]],
            contenido: [null, [Validators.required]],
            estado: [null, [Validators.required]],
            referencia: [null],
        });
        this.obtenerTodos();

    }

    obtenerTodos(){
        this.articuloService.getArticulos().subscribe({
            next: (data: any) => {
                console.log(data);
                this.dataSource.data = data;
                this.dataChange.next(data); // Inicializa el BehaviorSubject con los datos del árbol
                this.dataChange.subscribe(data => this.dataSource.data = data); // Suscríbete a los cambios y actualiza la fuente de datos
                this.resetTree();
            },
            error: (err) => { console.log("Error al cargar los Artículos") }
        })
    }

    hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;


    logNodeData(node: any) {
        console.log(node);
        this.NodoSeleccionado.emit([node]);
    }

    search() {
        const searchText = this.searchText.toLowerCase();
        this.resetTree(); // Restablece el árbol a su estado original antes de cada búsqueda

        if (searchText) {
            this.dataSource.data.forEach(node => {
                this.filterNodes(node, searchText);
            });
            this.expandNodes(); // Función para expandir solo los nodos necesarios
            const visibleNodes = this.getVisibleNodes(this.dataSource.data);
            console.log("Nodos visibles tras la búsqueda:", visibleNodes); // Imprimir los nodos visibles
            //Enviar al componente los visibles
            this.NodoSeleccionado.emit(visibleNodes); 
        } else {
            this.articuloService.getArticulos().subscribe({
                next: (data: any) => {
                    this.dataSource.data = data;
                    this.dataChange.next(data); // Inicializa el BehaviorSubject con los datos del árbol
                    this.dataChange.subscribe(data => this.dataSource.data = data); // Suscríbete a los cambios y actualiza la fuente de datos
                    this.resetTree();
                    this.NodoSeleccionado.emit(data);
                },
                error: (err) => { console.log("Error al cargar los Artículos") }
            })
            this.treeControl.collapseAll(); // Colapsa todo si no hay texto de búsqueda
        }
    }

    // Función para restablecer la visibilidad
    resetVisibility(nodes: Node[]) {
        nodes.forEach(node => {
            node.isVisible = false;
            if (node.children) {
                this.resetVisibility(node.children);
            }
        });
    }

    resetTree() {
        this.treeControl.collapseAll();
        this.resetVisibility(this.dataSource.data);
    }

    // Función recursiva para buscar y marcar nodos
    filterNodes(node: Node, searchText: string, ancestors: Node[] = []): boolean {
        node.isVisible = node.name.toLowerCase().includes(searchText);

        if (node.children) {
            const childrenVisible = node.children.map(child => this.filterNodes(child, searchText, [...ancestors, node])).some(visible => visible);
            node.isVisible = node.isVisible || childrenVisible;
        }

        if (node.isVisible && ancestors.length) {
            // Aquí solo marcas los ancestros para expansión, pero la expansión real la haremos después
            ancestors.forEach(ancestor => ancestor.isExpanded = true);
        }

        return node.isVisible;
    }


    expandNodes() {
        const expandRecursive = (node: Node) => {
            if (node.isExpanded) {
                this.treeControl.expand(node);
                node.isExpanded = false; // Opcional: limpiar la marca si no se necesita después
            }
            if (node.children) {
                node.children.forEach(child => expandRecursive(child));
            }
        };

        this.dataSource.data.forEach(node => expandRecursive(node));
    }


    agregarPadre() {
        // Añadir lógica para generar un nuevo nodo
        const nuevoHijo: Node = {
            name: this.form.controls['titulo'].value,
            content: this.content,
            state: this.form.controls['estado'].value,
            children: [],
            referencia:this.form.controls['referencia'].value,
            isVisible:false,
            isExpanded:false
        };
        // actualizamos la fuente de datos para forzar un cambio de detección.
        this.actualizarDatos();
        // No modifiques directamente this.dataSource.data. En su lugar, emite un nuevo valor a través de dataChange
        this.dataChange.next(this.dataSource.data);
        this.classApplied = !this.classApplied;


        //guardar base de datos
        this.articuloService.createArticulo(nuevoHijo).subscribe({
            next: (resp:any) => {
                console.log(resp);
                this.banderaPadre = false;
                this.obtenerTodos();
            },
            error: err => {
                console.log('Error al guardar');
            }
        });
    }

    agregarHijo(node: Node) {
        console.log(node);
        console.log(this.datoSeleccionadoGuardar);
        // Añadir lógica para generar un nuevo nodo
        const nuevoHijo: Node = {
            name: this.form.controls['titulo'].value,
            content: this.content,
            state: this.form.controls['estado'].value,
            children: [],
            referencia:"",
            isVisible:false,
            isExpanded:false
        };
        if (!node.children) {
            node.children = [];
        }
        node.children.push(nuevoHijo);
        // actualizamos la fuente de datos para forzar un cambio de detección.
        this.actualizarDatos();
        // No modifiques directamente this.dataSource.data. En su lugar, emite un nuevo valor a través de dataChange
        this.dataChange.next(this.dataSource.data);
        this.classApplied = !this.classApplied;


        //guardar base de datos
        if(this.datoSeleccionadoGuardar?.id_padre == null){
            this.articuloService.createHijos(nuevoHijo,this.datoSeleccionadoGuardar?.id, this.datoSeleccionadoGuardar?.id).subscribe({
                next: (resp:any) => {
                    console.log(resp);
                    this.obtenerTodos();
                },
                error: err => {
                    console.log('Error al guardar');
                }
            });
        }else{
            this.articuloService.createHijos(nuevoHijo,this.datoSeleccionadoGuardar?.id_padre, this.datoSeleccionadoGuardar?.id).subscribe({
                next: (resp:any) => {
                    console.log(resp);
                    this.obtenerTodos();
                },
                error: err => {
                    console.log('Error al guardar');
                }
            });
        }
        
    }

    private actualizarDatos() {
        // Forzamos una nueva referencia para el array de datos para que Angular detecte el cambio.
        const data = this.dataSource.data;
        this.dataSource.data = [];
        this.dataSource.data = data;
    }


    /* abrirModalNuevo(node: Node) {

    } */



    abrirModalNuevo(node: Node) {
        this.classApplied = !this.classApplied;
        console.log(this.classApplied);
        console.log(node);
        this.datoSeleccionado = node;
        this.datoSeleccionadoGuardar = JSON.parse(JSON.stringify(node));
        console.log(this.datoSeleccionadoGuardar);
    }

    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    guardarNodo() {
        console.log(this.datoSeleccionado);
        if(this.banderaPadre){
            this.agregarPadre();
        }else{
            this.agregarHijo(this.datoSeleccionado);
        }
        
    }

    handleEditorContentChanged(content: string) {
        this.content = content;
    }


    getVisibleNodes(nodes: Node[]): Node[] {
        const visibleNodes: Node[] = [];
    
        const traverseNodes = (nodes: Node[]) => {
            nodes.forEach(node => {
                if (node.isVisible) {
                    visibleNodes.push(node);
                }
                if (node.children) {
                    traverseNodes(node.children);
                }
            });
        };
    
        traverseNodes(nodes);
    
        return visibleNodes;
    }


    crearArticulo(banderaPadre:boolean){
        this.banderaPadre = banderaPadre;
        this.toggleClass();
    }



}