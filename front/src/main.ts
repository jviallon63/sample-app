import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app.routing';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(AppRoutingModule), provideHttpClient(withInterceptorsFromDi()), provideAnimations()]
}).catch((err) => console.error(err));
