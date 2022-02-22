import { Component, OnInit } from '@angular/core';
import { ApiService } from "../_services/api.service";
import { ModalController } from "@ionic/angular";
import { NotificationMessagePage } from "../_model/notification-message/notification-message.page";
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonService } from "../_services/common.service";
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  notifications: any = [];
  skeleton: any = [];
  searchTerm: string;
  searchControl: FormControl;
  searching: boolean;

  constructor(
    private api: ApiService,
    private modalController: ModalController,
    public common: CommonService
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit(): void {
    this.getAllNotifications();
    this.skeleton.length = 8;

    this.searchControl.valueChanges
    .pipe(debounceTime(700),
      distinctUntilChanged()
    )
    .subscribe(search => {
      this.searching = false;
      this.setFilteredItems(search);
    });
  }

  doRefresh(event: any) {
    console.log("Begin async operation");
    this.getAllNotifications();

    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }

  searchInput(event: any) {
    this.searching = true;
    let val = event.target.value;
    if (!val || !val.trim()) {
      this.getAllNotifications();
    } else {
      if (event.detail.inputType === 'deleteContentBackward' && event.target.value !== '') {
        this.getAllNotifications();
      } else {
        this.searchTerm = val;
      }
    }
  }

  getAllNotifications() {
    this.api.getRequest("Mobile/GetNotifications").subscribe((res: any) => {
      console.log("Res:", res);
      if (res?.message === "Success") {
        this.notifications = res?.lstModel;
      }
      console.log("notifications:", this.notifications);
    });
  }

  setFilteredItems(search) {
    this.notifications = this.filterNotifications(search);
  }

  filterNotifications(searchTerm) {
    return this.notifications.filter(n => {
      return n?.notes?.toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1;
    });
  }

  async presentNotificationModal(notification: any) {
    console.log("notification:", notification);
    const modal = await this.modalController.create({
      component: NotificationMessagePage,
      cssClass: "notification-modal",
      componentProps: {
        userName: notification?.userName,
        notificationNote: notification?.notes,
        id: notification?.trackId,
        readStatus: notification?.readStatus,
      },
    });

    modal.onDidDismiss().then((data) => {
      console.log("user:", data);
      if (data?.role === "backdrop") {
        if (notification?.readStatus === 1) {
          this.getAllNotifications();
        } else {
          console.log("already read");
        }
      }
    });

    return await modal.present();
  }

}
