import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
//import { AUTH_STRATEGY, authStrategyProvider } from './service/authentication/auth-strategy';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './service/authentication/auth-interceptor';
import { AuthModule } from './service/authentication/auth-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withInterceptorsFromDi()), 
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor,
      multi: true,
    },
    //{provide: AUTH_STRATEGY, useValue: authStrategyProvider},
    importProvidersFrom(AuthModule),
    provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};


