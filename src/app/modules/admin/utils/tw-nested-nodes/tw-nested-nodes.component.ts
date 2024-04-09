import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CustomizerSettingsService } from '../../../../common/customizer-settings/customizer-settings.service';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface Node {
    id?: string;
    name: string;
    content?: string;
    state?: string;
    children?: Node[];
    isVisible?: boolean;
    isExpanded?: boolean;
}

const TREE_DATA: Node[] = [
    {
        name: 'CAPITULO I',
        content: 'Informacion de capitulo 1',
        state: 'Activo',
        children: [{ name: 'Articulo 1' }, { name: 'Articulo 2' }, { name: 'Articulo 3' }],
    },
    {
        name: 'CAPITULO II',
        content: 'Informacion de capitulo 2',
        children: [
            {
                name: 'Articulo 5',
                children: [{ name: 'Articulo 5.1' }, { name: 'Articulo 5.2' }],
            },
            {
                name: 'Articulo 6',
                children: [
                    {
                        name: 'Articulo 6.1',
                        children: [
                            { name: 'Parrafo 1' },
                            { name: 'Parrafo 2' },
                            { name: 'Parrafo 3' },
                            { name: 'Parrafo 4' },
                        ]
                    },
                    {
                        name: 'Articulo 6.2',
                        children: [
                            { name: 'Parrafo 1' },
                            { name: 'Parrafo 2' },
                            { name: 'Parrafo 3' },
                            { name: 'Parrafo 4' },
                            { name: 'Parrafo 5' },
                            { name: 'Parrafo 6' },
                            { name: 'Parrafo 7' },
                        ]
                    },
                    { name: 'Articulo 6.3' },
                    { name: 'Articulo 6.4' },
                ],
            },
        ],
    },
];

@Component({
    selector: 'app-tw-nested-nodes',
    standalone: true,
    imports: [MatTreeModule, MatButtonModule, MatIconModule, FormsModule, MatCardModule],
    templateUrl: './tw-nested-nodes.component.html',
    styleUrl: './tw-nested-nodes.component.scss'
})
export class TwNestedNodesComponent {

    // Añade un BehaviorSubject para manejar los datos del árbol
    private dataChange = new BehaviorSubject<Node[]>([]);

    treeControl = new NestedTreeControl<Node>(node => node.children);
    dataSource = new MatTreeNestedDataSource<Node>();
    searchText = '';
    originalData = TREE_DATA;
    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.dataSource.data = TREE_DATA;
        this.dataChange.next(TREE_DATA); // Inicializa el BehaviorSubject con los datos del árbol
        this.dataChange.subscribe(data => this.dataSource.data = data); // Suscríbete a los cambios y actualiza la fuente de datos
    }

    hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;


    logNodeData(node: any) {
        console.log(node);
    }

    search() {
        const searchText = this.searchText.toLowerCase();
        this.resetTree(); // Restablece el árbol a su estado original antes de cada búsqueda

        if (searchText) {
            this.dataSource.data.forEach(node => {
                this.filterNodes(node, searchText);
            });
            this.expandNodes(); // Nueva función para expandir solo los nodos necesarios
        } else {
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


    agregarHijo(node: Node) {
        // Añadir lógica para generar un nuevo nodo
        const nuevoHijo: Node = {
            name: 'Articulo 4',
            content: 'Informacion de capitulo 1',
            state: 'Activo',
            children: [],
        };
        if (!node.children) {
            node.children = [];
        }
        node.children.push(nuevoHijo);
        // actualizamos la fuente de datos para forzar un cambio de detección.
        this.actualizarDatos();
        // No modifiques directamente this.dataSource.data. En su lugar, emite un nuevo valor a través de dataChange
        this.dataChange.next(this.dataSource.data);
    }

    private actualizarDatos() {
        // Forzamos una nueva referencia para el array de datos para que Angular detecte el cambio.
        const data = this.dataSource.data;
        this.dataSource.data = [];
        this.dataSource.data = data;
    }

}