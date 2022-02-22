import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { CommonService } from '../_services/common.service';
import { LanguagePage } from '../_popover/language/language.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileDetails: any = [];
  userDetails: any = [];

  constructor(
    private api: ApiService,
    public common: CommonService
  ) {
    if (this.common.router.getCurrentNavigation().extras.state) {
      this.userDetails =
        this.common.router.getCurrentNavigation().extras.state.userInfo;
      console.log("userDetails:", this.userDetails);
    }
  }

  ngOnInit() {
    // this.getUserProfileDetails();
  }

  getUserProfileDetails() {
    this.api.getRequest('Mobile/GetProfile').subscribe((res: any) => {
      console.log('Res:',res);
      if (res?.message === 'Success') {
        this.profileDetails = res?.model;
      }
      console.log('profileDetails:',this.profileDetails);
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.common.popOver.create({
      component: LanguagePage,
      cssClass: 'days-sort-popover',
      event: ev,
      translucent: true,
    });
    popover.onDidDismiss().then((result) => {
      console.log(result?.data);
    });
  
   return await popover.present();
  }

}
