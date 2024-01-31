import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  children?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
  { path: '/home', title: 'Home', icon: 'home', class: '', children: [] },
  // { path: '/faculty', title: 'User', icon: 'group', class: '', children: [] },
  // { path: '/curriculum', title: 'Curriculum', icon: 'library_books', class: '', children: [] },
  { path: '/assessments', title: 'Assessment', icon: 'assessment', class: '', children: [] },
  { path: '/attainment', title: 'Attainment', icon: 'track_changes', class: '', children: [] },
];

export const ADMINROUTES: RouteInfo[] = [
  { path: '/home', title: 'Home', icon: 'home', class: '', children: [] },
  { path: '/faculty', title: 'User', icon: 'group', class: '', children: [] },
  { path: '/curriculum', title: 'Curriculum', icon: 'library_books', class: '', children: [] },
  { path: '/assessments', title: 'Assessment', icon: 'assessment', class: '', children: [] },
  { path: '/attainment', title: 'Attainment', icon: 'track_changes', class: '', children: [] },
];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  menuItems: RouteInfo[] | undefined;
  user: any;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private dataService: DataService,
    private httpClient: HttpClient,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.httpClient.post(`${environment.serverUrl}/users/get-admin`,{}, {
      headers: this.dataService.httpHeaders
    }).toPromise()
      .then((value: any) => {
        let obj = value['isAdmin'];
        if(obj)
        this.menuItems = ADMINROUTES.map(e => e);
      }, (error) => {
        this.toast.warning("Something went wrong while fetching data from server...")
      })
    this.menuItems = ROUTES.map(e => e);
    this.user = JSON.parse(localStorage.getItem('user') || "");
  }

  logOut() {
    localStorage.clear();
    this.cookieService.deleteAll();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
