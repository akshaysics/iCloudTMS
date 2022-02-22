/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { CommonService } from '../_services/common.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-confirm-delivery',
  templateUrl: './confirm-delivery.page.html',
  styleUrls: ['./confirm-delivery.page.scss'],
})
export class ConfirmDeliveryPage implements OnInit {
  tripDetails: any = [];
  today: Date;
  selectedMedia: any = [];
  comments: string;
  base64textString: string;

  constructor(private api: ApiService, public common: CommonService, public camera: Camera,
    ) {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.tripDetails =
          this.common.router.getCurrentNavigation().extras.state.trip;
        console.log("tripDetails:", this.tripDetails);
      }
    });
   }

  ngOnInit() {
    this.today = new Date();
    this.base64textString = "";
  }

  doSomething(event: any) {
    console.log("event:", event?.detail?.value);
    this.today = event?.detail?.value;
    this.common.modalCtrl.dismiss();
  }

  // onChange(event: any) {
  //   console.log("event:", event);
  //   this.selectedMedia = event.target.files;
  //   console.log("selectedMedia:", this.selectedMedia);

  //   var files = event.target.files;
  //   var file = files[0];

  //   if (files && file) {
  //     var reader = new FileReader();

  //     reader.onload = this._handleReaderLoaded.bind(this);

  //     reader.readAsBinaryString(file);
  //   }

  // }
  // _handleReaderLoaded(readerEvt) {
  //   var binaryString = readerEvt.target.result;
  //   this.base64textString = btoa(binaryString);
  //   console.log(btoa(binaryString));
  //   console.log("base64textString:", this.base64textString);
  // }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(async (imageData) => {

      this.base64textString = imageData;
      console.log('base64textString:',this.base64textString);
    }, (err) => {
      console.log('Error:',err);
    });
  }

  gotoPage() {
    console.log("this.choosedFileToBase64[0]: ", this.base64textString);
    if (this.base64textString !== "") {
      this.common.simpleLoader();
      const params = {
        subSystemLoadId: this.tripDetails?.SubSystemLoadId,
        status: this.tripDetails?.Status,
        notes: this.comments,
        rate: this.tripDetails?.Rate,
        lstSubSystemloaduploadModel: [
          {
            mapNumber: 0,
            fileName: this.tripDetails?.SystemLoadNumber+'.jpeg',
            filePath: this.base64textString,
            fileType: 'image/jpeg',
            subSystemLoadId: this.tripDetails?.SubSystemLoadId,
            subSystemStatus: this.tripDetails?.Status,
            type: 0,
            createdDate: this.today,
          },
        ],
      };
      console.log("params:", params);
      this.api
        .postRequestWithParams("Mobile/UpdateSubLoadStatus", params)
        .subscribe(
          (res: any) => {
            console.log("res:", res);
            if (res.message === "Record updated successfully") {
              this.common.dismissLoader();
              const toastMsg = "Confirm Delivery document updated successfully";
              const toastTime = 1000;
              this.common.presentToast(toastMsg, toastTime);
              const navigationExtras: NavigationExtras = {
                state: {
                  trip: this.tripDetails,
                },
              };
              this.common.router.navigate(
                ["/trip-status"],
                navigationExtras
              );
            }
          },
          (err) => {
            this.common.dismissLoader();
            console.log("err:", err);
          }
        );
    } else {
      const alertHead = " Failed !";
      const alertMessage = "You must need to upload confirm delivery documents";
      this.common.presentAlert(alertHead, alertMessage);
    }
  }

  // gotoPage(page: string) {
  //   const navigationExtras: NavigationExtras = {
  //     state: {
  //       payroll: this.tripDetails
  //     }
  //   };
  //   this.common.router.navigate([page], navigationExtras);
  // }

}
