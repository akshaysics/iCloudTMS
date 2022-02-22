import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../_services/api.service';

@Component({
  selector: 'app-notification-message',
  templateUrl: './notification-message.page.html',
  styleUrls: ['./notification-message.page.scss'],
})
export class NotificationMessagePage implements OnInit {
  // Data passed in by componentProps
  @Input() userName: string;
  @Input() notificationNote: string;
  @Input() id: number;
  @Input() readStatus: number;

  constructor(private api: ApiService) {}

  ngOnInit() {}

  ionViewWillLeave() {
    this.markAsRead();
  }

  markAsRead() {
    if (this.readStatus === 1) {
      this.api
        .getRequestWithParams('Mobile/MarkNotificationAsRead/', this.id)
        .subscribe(
          (res: any) => {
            console.log('Res:', res);
          },
          (err) => {
            console.log('Error:', err);
          }
        );
    } else {
      console.log('already read');
    }
  }
}
