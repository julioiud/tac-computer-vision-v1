import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  private apiUrl = 'https://detect.roboflow.com/tac_aguacate/2';
  private apiKey = 'mTU7L3RPPsBFh9HzBmR5';

  constructor(private http: HttpClient) { }

  detectImage(image: string): Observable<any> {

    console.log('detectImage')

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const params = new HttpParams()
      .set('api_key', this.apiKey);

    return this.http.post(
      this.apiUrl, 
      image, 
      { headers, params }
    );
  }
}
