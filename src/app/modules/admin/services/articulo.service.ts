import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

const base_url = environment.url_api;

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  constructor(
    private http: HttpClient
  ) { }


  getArticulos(page:Number, size: Number) {
    return this.http.get(`${base_url}/articulos?page=${page}&size=${size}`);
  }

}
