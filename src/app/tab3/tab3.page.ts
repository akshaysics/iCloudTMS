/* eslint-disable @typescript-eslint/quotes */
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { CommonService } from "../_services/common.service";
import { TokenService } from "../_services/token.service";
import { ApiService } from "./../_services/api.service";
import Chart from "chart.js/auto";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page implements OnInit {
  @ViewChild("doughnutCanvas") private doughnutCanvas: ElementRef;

  doughnutChart: Chart<"doughnut", number[], string>;
  userDetails: any = [];
  dashBoardDetails: any = [];
  // RemainingValue: number;

  constructor(
    private token: TokenService,
    private common: CommonService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.getUserDetails();
    // this.getDeviceScreenSize();
    this.getDashBoardDetails();
    this.pushDriverLocation();
  }

  getUserDetails() {
    this.token.storage.get("USER_DETAILS").then((val) => {
      this.userDetails = val;
      console.log("userDetails:", this.userDetails);
    });
  }

  getDashBoardDetails() {
    this.api.getRequest("Mobile/GetDashBoardTripStatus").subscribe(
      (res: any) => {
        console.log("Res:", res);
        this.dashBoardDetails = res?.lstModel;
        console.log("dashBoardDetails:", this.dashBoardDetails);
        // this.RemainingValue =
        //   100 -
        //   (this.dashBoardDetails[0]?.AssignmentCount +
        //     this.dashBoardDetails[1]?.AssignmentCount +
        //     this.dashBoardDetails[2]?.AssignmentCount +
        //     this.dashBoardDetails[3]?.AssignmentCount);
        // console.log(
        //   "dashBoardDetails:",
        //   this.dashBoardDetails[0]?.AssignmentCount +
        //     this.dashBoardDetails[1]?.AssignmentCount +
        //     this.dashBoardDetails[2]?.AssignmentCount +
        //     this.dashBoardDetails[3]?.AssignmentCount
        // );
        // console.log("RemainingValue:", this.RemainingValue);
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  ionViewDidEnter() {
    this.doughnutChartMethod();
  }

  // ionViewDidEnter() {
  //   this.doughnutChartMethod();
  //   // const myInterval = setInterval(() => {
  //   //   this.pushDriverLocation()
  //   // }, 2000);
  // }

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
      type: "doughnut",
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
              "#0A5C49",
              "#F11ECF",
              "#0DC335",
              "#570FEF",
              "#001AFF1A",
            ],
          },
        ],
      },
    });
  }

  pushDriverLocation() {
    this.common
      .FetchUserLocation()
      .then((resp) => {
        console.log("latitude:", resp?.coords?.latitude);
        console.log("longitude:", resp?.coords?.longitude);
        if (resp) {
          const params = {
            lat: JSON.stringify(resp?.coords?.latitude),
            long: JSON.stringify(resp?.coords?.longitude),
            name: this.userDetails?.firstName,
            driverId: this.userDetails?.driverId,
          };
          this.api
            .postRequestWithParams("Mobile/PushDriverLocation", params)
            .subscribe(
              (res: any) => {
                console.log("res:", res);
              },
              (err) => {
                console.log("Error:", err);
              }
            );
        }
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }
}
