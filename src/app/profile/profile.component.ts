import {Component, ElementRef, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment.prod';
import {KeycloakProfile} from 'keycloak-js';

@Component({
  selector: 'app-profile',
  template: `
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
    <div *ngIf="!authenticated" class="buttons">
      <a class="button is-primary" (click)="signUpClick()">
        <strong>Sign up</strong>
      </a>
      <a class="button is-light" (click)="loginOnClick()">
        <strong>Log in</strong>
      </a>
    </div>

    <div *ngIf="authenticated">
      <div class="navbar-item has-dropdown is-hoverable">

        <a class="navbar-item">
          <span class="icon">
            <i class="fas fa-lg fa-user"></i>
          </span>
          <div *ngIf="userProfile">
            {{userProfile.username}}
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
  userProfile: KeycloakProfile;
  token: string;


  tokenChangedEvent: CustomEvent =
    new CustomEvent('tokenChanged', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        token: this.token,
        userProfile: this.userProfile
      }
    });


  constructor(private keycloakService: KeycloakService, private elRef: ElementRef) {
  }

  ngOnInit() {
    const {keycloakConfig} = environment;
    this.keycloakService
    .init({
      config: keycloakConfig, initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: true
      }
    })
    .then((authenticated) => {
      if (authenticated) {
        const userProfilePromise = this.keycloakService.loadUserProfile();
        // .then((userProfile) => {
        //   this.userProfile = userProfile;
        //   console.log(this.userProfile);
        // });
        const tokenPromise = this.keycloakService.getToken();
        // .then((token) => {
        //   this.token = token;
        //   console.log(this.token);
        // });
        console.log('Authenticated on Init');
        Promise.all([userProfilePromise, tokenPromise]).then((results) => {
          this.userProfile = results[0];
          this.token = results[1];
          const triggeredEvent = new CustomEvent('tokenChanged', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              token: this.token,
              userProfile: this.userProfile
            }}
          );
          this.elRef.nativeElement.dispatchEvent(triggeredEvent);
        });
        this.authenticated = authenticated;
      }}).catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error));

    window.addEventListener('userAction', this.updateToken.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('userAction', this.updateToken.bind(this));
  }

  signUpClick() {
    console.log('Register');
    this.keycloakService.register();
  }

  loginOnClick() {
    console.log('Login');
    this.keycloakService.login();
  }

  logoutOnClick() {
    this.keycloakService.logout();
    this.authenticated = false;
    console.log('Logout');
  }

  updateToken() {
    console.log('blubb');
    console.log(this.authenticated);
    // console.log('userAction event received');
    // this.keycloakService.updateToken(5).then((updated) => {
    //   if (updated) {
    //     this.keycloakService.loadUserProfile().then((userProfile) => {
    //       this.userProfile = userProfile;
    //       console.log(this.userProfile);
    //     });
    //     this.keycloakService.getToken().then((token) => {
    //       this.token = token;
    //       console.log(this.token);
    //     });
    //     console.log('Token updated');
    //   } else {
    //     console.log('Token not updated?');
    //   }
    // }).catch( (err) => {
    //   console.log(err);
    // });
  }
}
