import { ApiService } from "./../_services/api.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { TokenService } from "../_services/token.service";
import Chart from "chart.js/auto";
import { CommonService } from "../_services/common.service";

@Component({
  selector: "app-folder",
  templateUrl: "./folder.page.html",
  styleUrls: ["./folder.page.scss"],
})
export class FolderPage implements OnInit {
  @ViewChild("doughnutCanvas") private doughnutCanvas: ElementRef;
  doughnutChart: Chart<"doughnut", number[], string>;
  userDetails: any = [];

  constructor(
    private token: TokenService,
    private common: CommonService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.getUserDetails();
    this.getDeviceScreenSize();
    this.pushDriverLocation();
  }

  ionViewDidEnter() {
    this.doughnutChartMethod();
    // const myInterval = setInterval(() => {
    //   this.pushDriverLocation()
    // }, 1000);
  }

  ionViewWillLeave() {
    this.doughnutChart.destroy();
  }

  getDeviceScreenSize() {
    this.common.platform.ready().then(() => {
      console.log("Width: " + this.common.platform.width());
      console.log("Height: " + this.common.platform.height());
    });
  }

  doughnutChartMethod() {
    // const counter = {
    //   id: 'counter',
    //   beforeDraw( chart, args, options) {
    //     const { ctx, chartArea: { top, right, bottom, left, width, height } } = chart;
    //     ctx.save();
    //     ctx.fillStyle = 'blue';
    //     ctx.fillReact(width / 2 , top + (height / 2), 10, 10);
    //     ctx.font = '60px sans-serif';
    //     ctx.fillText('97%', width / 2, top + (height / 2));
    //   }
    // };

    // var canvas = <HTMLCanvasElement>document.getElementById('doughnutCanvas');
    // const ctx = canvas.getContext('2d');
    // const myChart = new Chart(ctx, {
    //   type: 'doughnut',
    //   data: {
    //             datasets: [
    //       {
    //         data: [50, 20, 10, 20],
    //         backgroundColor: ["#0DC335", "#FF8E00", "#570FEF", "#001AFF1A"],
    //       },
    //     ],
    //   },

    // });
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [50, 20, 10, 20],
            backgroundColor: ["#0DC335", "#FF8E00", "#570FEF", "#001AFF1A"],
          },
        ],
      }
    });
  }

  getUserDetails() {
    this.token.storage.get("USER_DETAILS").then((val) => {
      this.userDetails = val;
      console.log("userDetails:", this.userDetails);
    });
  }

  pushDriverLocation() {
    this.common
      .FetchUserLocation()
      .then((resp) => {
        // console.log('latitude:',resp?.coords?.latitude);
        // console.log('longitude:',resp?.coords?.longitude);
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

  doSomething(event: any) {
    console.log('event:',event);
    console.log('event:',event.detail.value);
  }

  confirm() {

  }

  reset() {

  }
}
