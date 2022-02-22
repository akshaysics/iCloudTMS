import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { CommonService } from '../_services/common.service';
import { TokenService } from '../_services/token.service';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import * as sha512 from 'js-sha512';
import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showLoader: boolean;
  isChecked: boolean;
  showPassword: boolean;
  pushNotification: any = [];

  constructor(
    private androidPermissions: AndroidPermissions,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private token: TokenService,
    private api: ApiService,
    private device: Device,
    private fcm: FCM
  ) {
    this.fetchDeviceToken();
  }

  ngOnInit(): void {
    this.showLoader = false;
    this.showPassword = true;
    this.loginFormValidator();
    this.common.menu.swipeGesture(false);
    this.fetchCheckedUserDetails();
    this.subscribePushNotification();
    this.getToken();
    this.fetchAndroidPermission();
  }

  loginFormValidator() {
    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      otp: ['string'],
      capchaValue: ['string'],
      userType: [0],
      mobileFCMToken: [this.device.uuid],
    });
  }

  fetchAndroidPermission() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        (result) => console.log('Has permission?', result.hasPermission),
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.CAMERA
          )
      );
  }

  subscribePushNotification() {
    // this.common.platform.ready().then(() => {
      // if (this.common.platform.is('cordova')) {
        this.fcm.onNotification().subscribe(
          (data) => {
            if (data.wasTapped) {
              console.log('Received in background');
            } else {
              console.log('Received in foreground');
            }
          },
          (err) => {
            console.log('Error:', err);
          }
        );

        this.fcm.onTokenRefresh().subscribe(
          (token) => {
            console.log('token:', token);
            // Register your new token in your back-end if you want
            // backend.registerToken(token);
          },
          (err) => {
            console.log('Error:', err);
          }
        );
      // } else {
      //   console.log('web');
      // }
    // });
  }

  getToken() {
    if (this.common.platform.is('cordova')) {
      this.fcm
        .getToken()
        .then((token) => {
          console.log('token:', token);
          // Register your new token in your back-end if you want
          // backend.registerToken(token);
        })
        .catch((err) => {
          console.log('Error:', err);
        });
    } else {
      console.log('web');
    }
  }

  fetchDeviceToken() {
    if (this.common.platform.is('android')) {
      console.log('Device UUID is:', this.device.uuid);
    } else if (this.common.platform.is('desktop')) {
      this.device.uuid = 'APA91bFoi3lMMre9G3XzR1LrF4ZT82_15MsMdEICogXSLB8';
      console.log('Device UUID is:', this.device.uuid);
    }
  }

  onPasswordInput(event: any) {
    this.sha512(event?.detail?.value);
  }

  sha512(password: string) {
    const hash2 = sha512.sha512(password);
    this.loginForm.value.password = hash2;
  }

  loginSubmit() {
    if (this.loginForm.valid) {
      console.log('loginForm:', this.loginForm.value);
      this.showLoader = true;
      this.api
        .postRequestForLogin(
          'Auth/authenticatedriver',
          JSON.stringify(this.loginForm.value)
        )
        .subscribe(
          (res: any) => {
            console.log('res:', res);
            if (res?.success === true) {
              if (res?.message === 'Wrong UserName/Password') {
                this.showLoader = false;
                const alertHead = 'Failed!';
                const alertMessage =
                  'Invalid login credentials, Wrong UserName/Password';
                this.common.presentAlert(alertHead, alertMessage);
              } else {
                this.showLoader = false;
                this.common.navCtrl.navigateRoot('/tabs/tab3');
                // const loadMessage =
                //   "<strong>" +
                //   this.loginForm.value.userName +
                //   "</strong> successfully logged in.";
                // const loadTime = 1000;
                // this.common.presentLoading(loadMessage, loadTime);
                console.log('token:', res?.model?.token);
                this.token.saveToken(res?.model?.token);
                this.token.saveUser(res?.model);
                this.token.setStorage('USER_DETAILS', res?.model);
                this.token.setStorage('USER_TOKEN', res?.model?.token);
              }
            } else {
              console.log('failed');
              const toastMsg = 'Something went wrong, Please try again later';
              const toastTime = 3000;
              this.common.presentToast(toastMsg, toastTime);
            }
          },
          (err) => {
            this.showLoader = false;
            console.log('Error:', err);
            const toastMsg = 'Something went wrong, Please try again later';
            const toastTime = 3000;
            this.common.presentToast(toastMsg, toastTime);
          }
        );
    } else {
      const alertHead = 'Failed!';
      const alertMessage =
        'Please enter valid details and <strong>password must contain 6 digits.</strong>';
      this.common.presentAlert(alertHead, alertMessage);
      console.log('not valid');
    }
  }

  onCheckRemember(event: any) {
    if (this.loginForm.valid) {
      if (event?.detail?.checked === true) {
        const msg = 'Your Email and Password is stored successfully.';
        const time = 2000;
        this.token
          .setStorage('USER_DETAILS_CHECKED', this.loginForm.value)
          .catch((err) => {
            console.log('Error', err);
            console.log('User Email and Password securely stored in device');
          });
        this.common.presentToast(msg, time);
      }
    } else {
      const msg = 'Please enter valid details and then click checkbox';
      const time = 2000;
      this.common.presentToast(msg, time);
      this.isChecked = false;
    }
  }

  fetchCheckedUserDetails() {
    this.token.storage
      .get('USER_DETAILS_CHECKED')
      .then((val) => {
        console.log('Value', val);
        this.loginForm.value.userName = val?.userName;
        this.loginForm.value.password = val?.password;
        if (!val) {
          console.log('No User Details Stored');
        } else {
          const msg =
            'We found your stored Email and Password, would you like to continue with that';
          const time = 2000;
          this.common.presentToast(msg, time);
        }
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }
}
