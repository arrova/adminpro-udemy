import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';

// import { SettingsService, SidebarService, SharedService }

// Rutas
import { APP_ROUTES } from './app.routes';

// Modules
import { PagesModule } from './pages/pages.module';
// import { Incre}mentadorComponent } from './components/incrementador/incrementador.component';

// Temporal
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginGuardGuard } from './services/guards/login-guard.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
    // IncrementadorComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    LoginGuardGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
