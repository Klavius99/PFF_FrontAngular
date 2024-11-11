import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideClientHydration } from '@angular/platform-browser';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideClientHydration() //Ajouter par Ndaraw pour reparer l'hydration
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
