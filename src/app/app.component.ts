/* eslint-disable @typescript-eslint/dot-notation */
import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { TokenService } from './_services/token.service';
import { ModalController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { LogoutPage } from './_model/logout/logout.page';
// import { BackgroundGeolocation } from '@awesome-cordova-plugins/background-geolocation/ngx';
// import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userDetails: any = [];
  public appPages = [
    {
      title: 'Dashboard',
      url: '/tabs/tab3',
      img: '../assets/side-menu/Vector.png',
    },
    { title: 'Trip', url: '/tabs/tab1', img: '../assets/side-menu/trip.png' },
    {
      title: 'Payroll',
      url: '/tabs/tab4',
      img: '../assets/side-menu/payrol.png',
    },
    {
      title: 'Profile',
      url: '/tabs/tab5',
      img: '../assets/side-menu/profile.png',
    },
    {
      title: 'Notification',
      url: '/tabs/tab2',
      img: '../assets/side-menu/notch.png',
    },
    {
      title: 'Support',
      url: '/support',
      img: '../assets/side-menu/support.png',
    },
    { title: 'Logout', url: '/logout', img: '../assets/side-menu/logout.png' },
  ];
  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private token: TokenService,
    private modalController: ModalController,
    // private backgroundGeolocation: BackgroundGeolocation,
    public menu: MenuController,
    public router: Router // private splashScreen: SplashScreen
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkUserDetails();
      if (this.platform.is('cordova')) {
        this.platform.pause.subscribe(() => {
          console.log('App is in background');
        });
        this.platform.resume.subscribe(() => {
          window['paused'] = 0;
          console.log('App is in foreground');
        });
      } else {
        console.log('Web view');
      }
    });
  }

  checkUserDetails() {
    this.token.storage
      .get('USER_DETAILS')
      .then(async (val) => {
        if (val) {
          this.navCtrl.navigateRoot('/tabs/tab3');
          this.userDetails = val;
          console.log('userDetails:', this.userDetails);
          this.token.saveToken(this.userDetails?.token);
          this.token.setStorage('USER_TOKEN', this.userDetails?.token);
        } else {
          await this.navCtrl.navigateRoot('/login');
        }
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }

  openPage(i: any) {
    if (this.appPages[i]?.title === 'Logout') {
      console.log('logout clicked');
      this.presentLogoutModal();
    } else {
      const route = this.appPages[i].url;
      const navigationExtras: NavigationExtras = {
        state: {
          userInfo: this.userDetails,
        },
      };
      this.router.navigate([route], navigationExtras);
    }
  }

  async presentLogoutModal() {
    const modal = await this.modalController.create({
      component: LogoutPage,
      cssClass: 'notification-modal',
    });
    return await modal.present();
  }

  doRefresh(event: any) {
    this.token.storage.get('USER_DETAILS').then((val) => {
      this.userDetails = val;
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ionWillOpen(event: any) {
    this.token.storage.get('USER_DETAILS').then((val) => {
      this.userDetails = val;
    });
  }
}
