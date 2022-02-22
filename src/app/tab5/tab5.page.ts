import { Component} from '@angular/core';
import { ApiService } from '../_services/api.service';
import { CommonService } from '../_services/common.service';
import { LanguagePage } from '../_popover/language/language.page';
import { TokenService } from '../_services/token.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})
export class Tab5Page {
  profileDetails: any = [];
  userDetails: any = [];
  constructor(
    private api: ApiService,
    public common: CommonService,
    private token: TokenService,
  ) {}

  ngOnInit() {
    this.getUserDetails();
    // this.getUserProfileDetails();
  }

  getUserDetails() {
    this.token.storage.get('USER_DETAILS').then((val) => {
      console.log('val:',val);
      this.userDetails = val;
    });
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