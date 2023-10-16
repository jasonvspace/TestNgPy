import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Project } from 'src/types';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  isVisible = false;
  loading = false;
  loadingAction = false;
  projects: Project[] = [];
  item_id?: number;

  validateForm: FormGroup<{
    title: FormControl<string>;
    description: FormControl<string>;
    active: FormControl<boolean>;
  }> = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    active: [false],
  });

  constructor(
    private apiService: ApiService,
    private nzMessageService: NzMessageService,
    private fb: NonNullableFormBuilder
  ) {}

  // ------------------------------------------------------ Get List
  getList = () => {
    this.loading = true;
    this.apiService.get('/projects/', { page: 1 }).subscribe((data) => {
      this.projects = data as Project[];
      this.loading = false;
    });
  };

  // ------------------------------------------------------ Update
  updateItem = (
    id: number,
    data: Omit<Project, 'id'>,
    refetch: boolean = false
  ) => {
    this.loadingAction = true;
    this.apiService.put(`/projects/${id}/`, data).subscribe((data) => {
      this.nzMessageService.success('Updated Successfully');
      this.isVisible = false;
      this.loadingAction = false;
      if (refetch) this.getList();
    });
  };

  // ------------------------------------------------------ Submit => Create or Update
  submitForm(): void {
    const data = this.validateForm.value as Project;
    this.loadingAction = true;
    if (this.item_id) {
      this.updateItem(this.item_id, data, true);
    } else {
      // create
      this.apiService.post('/projects/', data).subscribe(() => {
        this.loadingAction = false;
        this.isVisible = false;
        this.nzMessageService.success('Created a item successfully');
        this.getList();
      });
    }
  }

  // ------------------------------------------------------ Show Modal Create/Update
  showModal(data?: Project): void {
    this.isVisible = true;
    if (data) {
      this.item_id = data.id;
      this.validateForm.controls.title.setValue(data.title);
      this.validateForm.controls.description.setValue(data.description);
      this.validateForm.controls.active.setValue(data.active);
    } else {
      this.item_id = undefined;
      this.validateForm.reset();
    }
  }

  // ------------------------------------------------------ Toggle Active (completed)
  handleChangeActive(id: number): void {
    const index = this.projects.findIndex((el) => el.id === id);
    this.projects[index] = {
      ...this.projects[index],
      active: !this.projects[index].active,
    };
    this.updateItem(id, this.projects[index]);
  }

  cancel(): void {}

  // ------------------------------------------------------ Delete
  confirmDelete(id: number): void {
    this.apiService.delete(`/projects/${id}/`).subscribe(() => {
      this.nzMessageService.success('Deleted Successfully');
      this.getList();
    });
  }

  ngOnInit() {
    this.getList();
  }
}
