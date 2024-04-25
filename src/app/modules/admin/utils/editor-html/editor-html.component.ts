import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-editor-html',
  standalone: true,
  imports: [HttpClientModule, AngularEditorModule],
  templateUrl: './editor-html.component.html',
  styleUrl: './editor-html.component.scss'
})
export class EditorHtmlComponent {

}
