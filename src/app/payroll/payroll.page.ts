import { Component, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { ApiService } from "../_services/api.service";
import { CommonService } from "../_services/common.service";
import { PayrollPopoverPage } from "../_popover/payroll-sort/payroll-popover.page";
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-payroll",
  templateUrl: "./payroll.page.html",
  styleUrls: ["./payroll.page.scss"],
})
export class PayrollPage implements OnInit {
  userDetails: any = [];
  payRolls: any = [];
  skeleton: any = [];
  searchTerm: string;
  searchControl: FormControl;
  searching: boolean;

  constructor(private api: ApiService, public common: CommonService) {
    if (this.common.router.getCurrentNavigation().extras.state) {
      this.userDetails =
        this.common.router.getCurrentNavigation().extras.state.userInfo;
      console.log("userDetails:", this.userDetails);
    }

    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.getPayrolls();
    this.skeleton.length = 10;

    this.searchControl.valueChanges
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((search) => {
        this.searching = false;
        this.setFilteredItems(search);
      });
  }

  doRefresh(event: any) {
    console.log('Begin async operation');
    this.getPayrolls();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }


  getPayrolls() {
    const params = {
      searchValue: "",
      status: 0,
      driverId: this.userDetails?.driverId,
      companyId: this.userDetails?.companyId,
    };
    this.api.postRequestWithParams("Mobile/GetAllPayroll", params).subscribe(
      (res: any) => {
        console.log("Res:", res);
        this.payRolls = res?.lstModel;
      },
      (err) => {
        console.log("Error:", err);
      }
    );
  }
  gotoPage(payRollDetails: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        payroll: payRollDetails,
      },
    };
    this.common.router.navigate(["/payroll-details"], navigationExtras);
  }

  async presentPopover(ev: any) {
    const popover = await this.common.popOver.create({
      component: PayrollPopoverPage,
      cssClass: "days-sort-popover",
      event: ev,
      translucent: true,
    });
    popover.onDidDismiss().then((result) => {
      console.log(result?.data);
    });

    return await popover.present();
  }

  searchInput(event: any) {
    this.searching = true;
    let val = event.target.value;
    if (!val || !val.trim()) {
      this.getPayrolls();
    } else {
      if (
        event.detail.inputType === "deleteContentBackward" &&
        event.target.value !== ""
      ) {
        this.getPayrolls();
      } else {
        this.searchTerm = val;
      }
    }
  }

  setFilteredItems(search) {
    this.payRolls = this.filterItem(search);
  }

  filterItem(searchTerm) {
    console.log("payRolls:", this.payRolls);
    return this.payRolls.filter((item) => {
      console.log("item:", item, "payRolls:", this.payRolls);
      return (
        item.PayLoadNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
    });
  }
}
