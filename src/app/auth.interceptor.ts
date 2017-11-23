import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this._injector.get(AuthService).userCredentials.token;
    let authReq: any;

    if (authToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` }
      });
    }

    return authToken ? next.handle(authReq) : next.handle(req);
  }
}
