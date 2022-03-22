/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/quotes */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CommonService } from '../_services/common.service';
import { TokenService } from '../_services/token.service';
import { ApiService } from './../_services/api.service';
import Chart from 'chart.js/auto';
// import { DocScannerConfig } from 'ngx-document-scanner';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  doughnutChart: Chart<'doughnut', number[], string>;
  userDetails: any = [];
  dashBoardDetails: any = [];
  notifications: any = [];
  image: string;
//   config: DocScannerConfig = {
//     editorBackgroundColor: '#fafafa',
//     buttonThemeColor: 'primary',
//     cropToolColor: '#ff4081',
//     cropToolShape: 'circle',
//     exportImageIcon: 'cloud_download'
// };

  constructor(
    private token: TokenService,
    private common: CommonService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.getUserDetails();
    this.pushDriverLocation();
  }

  ionViewWillEnter() {
    this.getDashBoardDetails();
    this.getAllNotifications();
  }

  getUserDetails() {
    this.token.storage.get('USER_DETAILS').then((val) => {
      this.userDetails = val;
    });
  }

  getDashBoardDetails() {
    this.api.getRequest('Mobile/GetDashBoardTripStatus').subscribe(
      (res: any) => {
        if (res.success === true) {
          this.dashBoardDetails = res?.lstModel;
          this.doughnutChartMethod();
        } else {
          this.doughnutChart.destroy();
        }
      },
      // err => {
      //   const toastMsg = 'Something went wrong, Please try again later';
      //   const toastTime = 3000;
      //   this.common.presentToast(toastMsg, toastTime);
      // }
    );
  }

  ionViewWillLeave() {
    this.doughnutChart.destroy();
  }

  // getDeviceScreenSize() {
  //   this.common.platform.ready().then(() => {
  //     console.log("Width: " + this.common.platform.width());
  //     console.log("Height: " + this.common.platform.height());
  //   });
  // }

  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [
              this.dashBoardDetails[0]?.AssignmentCount,
              this.dashBoardDetails[1]?.AssignmentCount,
              this.dashBoardDetails[2]?.AssignmentCount,
              this.dashBoardDetails[3]?.AssignmentCount,
            ],
            backgroundColor: [
              '#0A5C49',
              '#F11ECF',
              '#0DC335',
              '#570FEF',
              '#001AFF1A',
            ],
          },
        ],
      },
    });
  }

  pushDriverLocation() {
    console.log('params:');
    this.common
      .FetchUserLocation()
      .then((resp) => {
        if (resp) {
          const params = {
            lat: JSON.stringify(resp?.coords?.latitude),
            long: JSON.stringify(resp?.coords?.longitude),
            name: this.userDetails?.firstName,
            driverId: this.userDetails?.driverId,
          };
          console.log('params:',params);
          this.api
            .postRequestWithParams('Mobile/PushDriverLocation', params)
            .subscribe(
              (res: any) => {
                console.log('Res:',res);
              }, err => {
                const toastMsg = 'Something went wrong on fetching your location';
                const toastTime = 3000;
                this.common.presentToast(toastMsg, toastTime);
              });
        }
      })
      .catch((error) => {
        const toastMsg = 'Something went wrong, Please try again later';
        const toastTime = 3000;
        this.common.presentToast(toastMsg, toastTime);
      });
  }

  getAllNotifications() {
    this.api.getRequest('Mobile/GetNotifications').subscribe((res: any) => {
      console.log('Res:', res);
      if (res.message === 'Success') {
         this.notifications = res.lstModel.filter((el) => {
          return el.readStatus === 1;
          });
      }
    });
  }
}
