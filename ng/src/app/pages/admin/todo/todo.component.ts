import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Todo, Project } from 'src/types';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  isVisible = false;
  loading = false;
  loadingAction = false;
  todos: Todo[] = [];
  projects: Project[] = [];
  todo_id?: number;
  project_id?: number;
  search = '';

  projects_title = this.projects.reduce(
    (acc, cur) => ((acc[`${cur.id}`] = cur['title'] || ''), acc),
    {} as Record<string, string>
  );
  getTitle = (id: number) =>
    this.projects.find((el) => el.id === id)?.title || 'Removed';

  validateForm: FormGroup<{
    project: FormControl<number>;
    title: FormControl<string>;
    description: FormControl<string>;
    active: FormControl<boolean>;
  }> = this.fb.group({
    project: [1, [Validators.required]],
    title: ['', [Validators.required]],
    description: [''],
    active: [false],
  });

  constructor(
    private apiService: ApiService,
    private nzMessageService: NzMessageService,
    private fb: NonNullableFormBuilder
  ) {}

  getList = () => {
    this.loading = true;

    this.apiService
      .get('/todos', {
        search: this.search || '',
        project: this.project_id || '',
      })
      .subscribe((data) => {
        this.todos = data as Todo[];
        this.loading = false;
      });
  };

  handleSearch = (v: any) => {
    this.search = v.target.value;
    this.getList();
  };
  handleFilterProject = (v: number) => {
    this.project_id = v;
    this.getList();
  };

  getProjects = () => {
    this.apiService.get('/projects/').subscribe((data) => {
      this.projects = data as Project[];
    });
  };

  submitForm(): void {
    var data = this.validateForm.value as Todo;
    this.loadingAction = true;
    if (this.todo_id) {
      this.updateItem(this.todo_id, data, true);
    } else {
      // create
      this.apiService.post('/todos/', data).subscribe(() => {
        this.loadingAction = false;
        this.isVisible = false;
        this.nzMessageService.success('Created a item successfully');
        this.getList();
      });
    }
  }

  showModal(data?: Todo): void {
    this.isVisible = true;
    if (data) {
      this.todo_id = data.id;
      this.validateForm.controls.project.setValue(data.project);
      this.validateForm.controls.title.setValue(data.title);
      this.validateForm.controls.description.setValue(data.description);
      this.validateForm.controls.active.setValue(data.active);
    } else {
      this.todo_id = undefined;
      this.validateForm.reset();
    }
  }

  cancel(): void {
    this.isVisible = false;
  }

  confirmDelete(id: number): void {
    this.apiService.delete(`/todos/${id}/`).subscribe(() => {
      this.nzMessageService.success('Deleted Successfully');
      this.getList();
    });
  }

  handleChangeActive(id: number): void {
    const index = this.todos.findIndex((el) => el.id === id);
    this.todos[index] = {
      ...this.todos[index],
      active: !this.todos[index].active,
    };
    this.updateItem(id, this.todos[index]);
  }

  updateItem = (
    id: number,
    data: Omit<Todo, 'id'>,
    refetch: boolean = false
  ) => {
    this.loadingAction = true;
    this.apiService.put(`/todos/${id}/`, data).subscribe((data) => {
      this.nzMessageService.success('Updated Successfully');
      this.isVisible = false;
      this.loadingAction = false;
      if (refetch) this.getList();
    });
  };

  ngOnInit() {
    this.getList();
    this.getProjects();
  }
}
