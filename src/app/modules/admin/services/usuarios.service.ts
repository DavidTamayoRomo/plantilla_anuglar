import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

const base_url = environment.url_api;


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ) { }


  getUsuarioApellido(apellido:string) {
    return this.http.get(`${base_url}/wso2/get-users-lastName/${apellido}`);
  }



}
