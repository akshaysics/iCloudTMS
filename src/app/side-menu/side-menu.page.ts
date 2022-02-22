import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { MenuController } from "@ionic/angular";
import { NavigationExtras, Router } from "@angular/router";
import { LogoutPage } from "../_model/logout/logout.page";
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {
  userDetails: any = [];
  public appPages = [
    {
      title: "Dashboard",
      url: "/folder",
      img: "../assets/side-menu/Vector.png",
    },
    { title: "Trip", url: "/trips", img: "../assets/side-menu/trip.png" },
    {
      title: "Payroll",
      url: "/payroll",
      img: "../assets/side-menu/payrol.png",
    },
    {
      title: "Profile",
      url: "/profile",
      img: "../assets/side-menu/profile.png",
    },
    {
      title: "Notification",
      url: "/notification",
      img: "../assets/side-menu/notch.png",
    },
    {
      title: "Support",
      url: "/support",
      img: "../assets/side-menu/support.png",
    },
    { title: "Logout", url: "/logout", img: "../assets/side-menu/logout.png" },
  ];
  constructor(
    private modalController: ModalController,
    public menu: MenuController,
    public router: Router
  ) { }

  ngOnInit() {
  }

  openPage(i: any) {
    if (this.appPages[i]?.title === "Logout") {
      console.log("logout clicked");
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
      cssClass: "notification-modal",
    });
    return await modal.present();
  }

  doRefresh(event: any) {
    console.log("Begin async operation");
    console.log("userDetails:", this.userDetails);

    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }

}
