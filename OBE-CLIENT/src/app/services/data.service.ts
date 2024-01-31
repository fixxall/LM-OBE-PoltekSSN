import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../models/course';
import { Curriculum } from '../models/curriculum';
import { Term } from '../models/term';
import { User } from '../models/user';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  curriculumsSub = new BehaviorSubject<Curriculum[]>([]);
  curriculumRetrieved: boolean = false;
  getAdminView: boolean = false;

  coursessSub = new BehaviorSubject<Course[]>([]);
  coursesRetrieved: boolean = false;

  termsSub = new BehaviorSubject<Term[]>([]);
  termsRetrieved: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private cookieService:CookieService
  ) { 
    this.userModel = JSON.parse(localStorage.getItem('user') || "");
  }

  getCookie(){
    return this.cookieService.get('cookie');
  }

  
  userModel: User;
  httpHeaders: HttpHeaders = new HttpHeaders({
    
    'Cache-Control': 'no-cache',
    'Authorization': this.getCookie() 
  });
  getCurriculums(): void {
    if(!this.curriculumRetrieved) {
      this.httpClient.get<{ curriculums: any[] }>(`${environment.serverUrl}/curriculums`, {
        headers: this.httpHeaders
      })
      .toPromise()
      .then(res => {
        this.curriculumsSub.next(res?.curriculums.filter(e => e.deptName === this.userModel?.department).map(e => e as Curriculum));
        this.curriculumRetrieved = true;
      }, err => {
        console.log(">>> error: ", err);
        
      });
    }
  }

  getCourses(): void {
    if(!this.coursesRetrieved) {
      this.httpClient.get<{ courses: Course[] }>(`${environment.serverUrl}/courses`, {
        headers: this.httpHeaders
      })
      .toPromise()
      .then((res) => {
        this.coursessSub.next(res?.courses.filter(x => x.courseOwnerId === this.userModel._id));    
        this.coursesRetrieved = true;
      }, (err) => {
        console.log(">>> error: ", err);
        
      })
    }
  } 
}

/**
 * batchId, termId => courses fetch OBE Server Route
 */