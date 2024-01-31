import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/constants';
import { DataService } from 'src/app/services/data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  children?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
  // { path: '/faculty', title: 'User', icon: 'group', class: '', children: [] },
  // { path: '/curriculum/courses', title: 'Courses', icon: 'library_books', class: '', children: [] },
  // { path: '/curriculum/co-mapping', title: 'Mapped CO with PO/PSO', icon: 'library_books', class: '', children: [] },
  { path: '/assessments', title: 'Assessment', icon: 'assessment', class: '', children: [] },
  { path: '/attainment/import-cia-marks', title: 'CIA Data Import', icon: 'track_changes', class: '', children: [] },
  { path: '/attainment/co-attainment', title: 'CO Attainement', icon: 'track_changes', class: '', children: [] },
  { path: '/profile', title: 'My Profile', icon: 'people', class: '', children: [] },
  // { path: '/change-passsword', title: 'Change Login Password', icon: 'key', class: '', children: [] },
];

export const ADMINROUTES: RouteInfo[] = [
  { path: '/faculty', title: 'User', icon: 'group', class: '', children: [] },
  { path: '/curriculum/courses', title: 'Courses', icon: 'library_books', class: '', children: [] },
  { path: '/curriculum/co-mapping', title: 'Mapped CO with PO/PSO', icon: 'library_books', class: '', children: [] },
  { path: '/assessments', title: 'Assessment', icon: 'assessment', class: '', children: [] },
  { path: '/attainment/import-cia-marks', title: 'CIA Data Import', icon: 'track_changes', class: '', children: [] },
  { path: '/attainment/co-attainment', title: 'CO Attainement', icon: 'track_changes', class: '', children: [] },
  { path: '/profile', title: 'My Profile', icon: 'people', class: '', children: [] },
  // { path: '/change-passsword', title: 'Change Login Password', icon: 'key', class: '', children: [] },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menuItems: RouteInfo[] = [];
  constructor(
    private dataService: DataService,
    private httpClient: HttpClient,
    private toast: ToastrService
  ) { }  

  ngOnInit(): void  {
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
      
  }

}
