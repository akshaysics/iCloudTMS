import { Component, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { ApiService } from "../_services/api.service";
import { CommonService } from "../_services/common.service";
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: "app-trips",
  templateUrl: "./trips.page.html",
  styleUrls: ["./trips.page.scss"],
})
export class TripsPage implements OnInit {
  userDetails: any = [];
  allTrips: any = [];
  skeleton: any = [];

  searchTerm: string;
  searchControl: FormControl;
  searching: boolean;

  constructor(private api: ApiService, public common: CommonService) {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
        console.log("userDetails:", this.userDetails);
      }
    });

    this.searchControl = new FormControl();

  }

  ngOnInit(): void {
    this.getTrips();
    this.skeleton.length = 10;

    this.searchControl.valueChanges
    .pipe(debounceTime(700),
      distinctUntilChanged()
    )
    .subscribe(search => {
      console.log('search:', search);
      this.searching = false;
      this.setFilteredItems(search);
    });
  }

  searchInput(event: any) {
    this.searching = true;
    let val = event.target.value;
    if (!val || !val.trim()) {
      this.getTrips();
    } else {
      if (event.detail.inputType === 'deleteContentBackward' && event.target.value !== '') {
        this.getTrips();
      } else {
        this.searchTerm = val;
      }
    }
  }

  doRefresh(event: any) {
    console.log('Begin async operation');
    this.getTrips();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  getTrips() {
    this.api
      .getRequestWithParams(
        "Mobile/GetAssignedSystemLoad/",
        0
      )
      .subscribe(
        (res: any) => {
          console.log("Res:", res);
          if (res?.success === true) {
            this.allTrips = res?.lstModel;
          } else {
            console.log('No data');
          }
        },
        (err) => {
          console.log("Error:", err);
        }
      );
  }

  setFilteredItems(search) {
    this.allTrips = this.filterNotifications(search);
  }

  filterNotifications(searchTerm) {
    return this.allTrips.filter(n => {
      return n?.SystemLoadNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  gotoPage(page: string, tripDetails: any) {
    const p = page;
    const navigationExtras: NavigationExtras = {
      state: {
        trip: tripDetails
      }
    };
    this.common.router.navigate([p], navigationExtras);
  }
}
