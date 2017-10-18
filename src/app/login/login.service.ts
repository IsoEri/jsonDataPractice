import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class LoginService {
  private link = 'http://www.corsproxy.com/localhost:1234/#//assets/json/sample-json.json';
  // private link = '/assets/json/sample-json.json';

  constructor(
    private http: Http
  ){};

  get(): Observable<Response>{
    return this.http.get(this.link);
  }
}
