import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from "@angular/elements";
import {ProfileComponent} from "./profile/profile.component";
// import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";

// const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    // KeycloakAngularModule
  ],
  providers: [],
  // providers: [
  //   {
  //     provide: KeycloakService,
  //     useValue: keycloakService
  //   }
  // ],
  bootstrap: [],
  entryComponents: [
    ProfileComponent
  ]
})
export class AppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const profile_element = createCustomElement(ProfileComponent, {injector: this.injector});
    customElements.define('profile-login', profile_element);
  }
}
