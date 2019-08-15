import {Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `
    <style>
      @import "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css";
      @import "https://kit-free.fontawesome.com/releases/latest/css/free-v4-shims.min.css";
      @import "https://kit-free.fontawesome.com/releases/latest/css/free-v4-font-face.min.css";
      @import "https://kit-free.fontawesome.com/releases/latest/css/free.min.css";
    </style>
    <div *ngIf="!keycloak.authenticated" class="buttons">
      <a class="button is-primary" (click)="signUpClick()">
        <strong>Sign up</strong>
      </a>
      <a class="button is-light" (click)="loginOnClick()">
        <strong>Log in</strong>
      </a>
    </div>

    <div *ngIf="keycloak.authenticated">
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-item">
          <span class="icon">
            <i class="fas fa-lg fa-user"></i>
          </span>
          <div>
            {{keycloak.tokenParsed.preferred_username}}
          </div>
        </a>

        <div class="navbar-dropdown">
          <a class="navbar-item" href="/order">Bestellungen</a>
          <a class="navbar-item" (click)="logoutOnClick()">Log out</a>
        </div>
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ProfileComponent implements OnInit, OnDestroy {

  authenticated: boolean;
  keycloak = window["keycloak"];


  constructor(private elRef: ElementRef) {
  }

  ngOnInit() {
    console.log("Profile Auth: " + this.keycloak.authenticated);
  }

  ngOnDestroy() {
  }

  signUpClick() {
    console.log('Register');
    this.keycloak.register();
  }

  loginOnClick() {
    console.log('Login');
    this.keycloak.login();
  }

  logoutOnClick() {
    this.keycloak.logout();
    this.authenticated = false;
    console.log('Logout');
  }
}
