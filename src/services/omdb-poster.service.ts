import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OmdbPosterService {
  imageUrl = "http://img.omdbapi.com/?i=";
  idUrl = "http://www.omdbapi.com/?t="
  apikey = "&apikey=f1a532aa";
  constructor(private http: HttpClient) { }

  /*getPoster(): Observable<Blob> {
    return this.http
      .get(this.url + nazov + "&apikey=f1a532aa", { responseType: 'blob' });
  }*/

  getPoster(nazov: string): Promise<Blob> {
    nazov = nazov.replace(" ", "+")
    return this.http
      .get<OmdbResponse>(this.idUrl + nazov + this.apikey)
      .toPromise()
      .then(
        response => this.http.get(this.imageUrl + response.imdbID + this.apikey, { responseType: 'blob' })
          .toPromise()
          .then(resp => {
            try{
              return resp;
            }catch(error){
              throw('Image not found');
            }
            
          })
      )
  }
}
interface OmdbResponse {
  imdbID: string;
}
