import { HttpClient } from '@angular/common/http';
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import { Component, OnInit, ValueSansProvider } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DEPARTMENTS } from 'src/app/models/constants';
import { Curriculum } from 'src/app/models/curriculum';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css'],
})
export class BatchesComponent implements OnInit {
  batchForm: FormGroup;
  batchUpdateBool: boolean = false;
  departments: any;
  curriculums: Curriculum[] = [];
  curriculumSub: Subscription | undefined;
  userModel: User = JSON.parse(localStorage.getItem('user') || '');

  constructor(
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private toast: ToastrService,
    private data: DataService
  ) {}

  ngOnInit(): void {
    this.departments = DEPARTMENTS;
    this.getCurriculums();
  }

  getCurriculums() {
    this.data.getCurriculums();
    this.curriculumSub = this.data.curriculumsSub.subscribe((res) => {
      if (res.length != 0) {
        this.curriculums = res;
      }
    });
  }

  openCurriculumModel(modalRef: any, curriculumObj: Curriculum | null = null) {
    this.modalService.open(modalRef, {
      size: 's',
    });

    if (curriculumObj === null) {
      this.batchUpdateBool = false;
      this.batchForm = new FormGroup({
        curriculumName: new FormControl(''),
        deptName: new FormControl(this.userModel.department),
        curriculumOwner: new FormControl(
          this.userModel.firstName + ' ' + this.userModel.lastName
        ),
        curriculumOwnerId: new FormControl(this.userModel._id),
      });
    } else {
      this.batchUpdateBool = true;
      this.batchForm = new FormGroup({
        _id: new FormControl(curriculumObj._id),
        curriculumName: new FormControl(curriculumObj.curriculumName),
        deptName: new FormControl(curriculumObj.deptName),
        curriculumOwner: new FormControl(curriculumObj.curriculumOwner),
        curriculumOwnerId: new FormControl(this.userModel._id),
      });
    }
  }

  submitForm(form: FormGroup) {
    // let values = { ...form.value }
    let curriculumObj: Curriculum | any = { ...form.value };

    if (!this.batchUpdateBool) {
      this.httpClient
        .post<{ response: Curriculum; error: any }>(
          `${environment.serverUrl}/curriculums/add-curriculum`,
          { ...curriculumObj },{headers: this.data.httpHeaders}
        )
        .toPromise()
        .then(
          (value) => {
            console.log(':>>> Value: ', value);

            this.modalService.dismissAll();
            this.toast.success('Batch Added Successfully');
            this.curriculums.push({ ...value.response });
          },
          (err) => {
            console.log('>>> err: ', err);

            this.toast.error(err.error.message);
          }
        );
      console.log(this.curriculums);
    } else {
      this.httpClient
        .put<{ response: Curriculum; error: any }>(
          `${environment.serverUrl}/curriculums/update-curriculum/${curriculumObj._id}`,
          { ...curriculumObj },
          {headers: this.data.httpHeaders}
        )
        .toPromise()
        .then(
          (value) => {
            console.log(':>>> Value: ', value);

            this.modalService.dismissAll();
            this.toast.success('Batch Updated Successfully');

            let idx = this.curriculums.findIndex(
              (x) => x._id === curriculumObj._id
            );
            this.curriculums[idx] = { ...value.response };
          },
          (err) => {
            console.log('>>> err: ', err);

            this.toast.error(err.error.message);
          }
        );
    }
  }

  deleteCurriculum(modalRef: any, id: any) {
    this.modalService.open(modalRef).result.then(
      (value) => {
        this.httpClient
          .delete(`${environment.serverUrl}/curriculums/delete/${id}`,{headers: this.data.httpHeaders})
          .toPromise()
          .then(
            (value) => {
              this.toast.success('Batch Deleted Successfully');
              let idx = this.curriculums.findIndex((x) => x._id === id);
              this.curriculums.splice(idx, 1);
            },
            (err) => {
              // console.log(">>> error", err);
            }
          );
      },
      (err) => {
        console.log('>>> error: ', err);
      }
    );
  }
}
