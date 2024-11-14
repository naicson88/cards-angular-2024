import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AUTH_STRATEGY, authStrategyProvider } from './service/authentication/auth-strategy';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),
    {provide: AUTH_STRATEGY, useValue: authStrategyProvider},
    provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};


