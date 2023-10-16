import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

type TypeLogin = {
  access: string;
};
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true],
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      this.apiService
        .post(`/token/`, {
          username: this.validateForm.value.userName,
          password: this.validateForm.value.password,
        })
        .subscribe((data) => {
          const data1 = data as TypeLogin;
          this.apiService.setToken(data1.access);
          this.router.navigate(['/admin/projects']);
        })
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}
}
