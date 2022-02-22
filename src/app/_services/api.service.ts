import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { TokenService } from "./token.service";

const BASE_URL = "https://login.icloudtms.com/api/";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  public userToken: string;

  constructor(public http: HttpClient, private token: TokenService) {
    this.userToken = this.token.getToken();
    // this.userToken = 'zyNhlGGXE3sj/zHffD/pfE9+03cQ6cAkGfTNlb6WNTIeHrvVhXICAqNbpxlTaSk7rLaw1E9wQKzQBWhil3RdIXANC3h8JVZTMtsa3cGWtcnPd+Wm5rdHpbV6qZg6753k8+3KpizxXOU3bPKQndSVg1zqNmCZU91Pnxg3VqAWjoxZ8LMk9UwAWPjmyZaZWwWtrId7BknNG7+l2s7ihCfv7RecsnFyFodp6GZMUBDiYXIQqo53pdfoWkPLUIUQqCLT7DvdayU/3g3z+xmXfAsZkeKwyFtgXKNVdshDgCysyyNhPMgnVqgmxBePGrqNgRww7sQZa9AXoNb7mcwzDkjlugzFhwc2SOgOI0AFHZIQYEfN6YiJnYg1Ag5KXWc99OpBI+4eroWM/Rs1iH8kog/Epw=='
  }

  postRequestForLogin(path: string, params: any) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "text/plain",
    };
    return this.http.post(BASE_URL + path, params, { headers });
  }

  getRequest(path: string) {
    const headers = {
      Accept: "text/plain",
      Authorization: "Bearer " + this.userToken,
    };
    return this.http.get(BASE_URL + path, { headers });
  }

  getRequestWithParams(path: string, params: any) {
    console.log("params:", params, this.userToken);
    const headers = {
      "Content-Type": "application/json",
      Accept: "text/plain",
      Authorization: "Bearer " + this.userToken,
    };
    return this.http.get(BASE_URL + path + params, { headers });
  }

  postRequestWithoutParams(path: string) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "text/plain",
      Authorization: "Bearer " + this.userToken,
    };
    return this.http.post(BASE_URL + path, { headers });
  }

  postRequestWithParams(path: string, params: any) {
    const headers = {
      "Content-Type": "application/json",
      accept: "text/plain",
      Authorization: "Bearer " + this.userToken,
    };
    return this.http.post(BASE_URL + path, params, { headers });
  }
}
