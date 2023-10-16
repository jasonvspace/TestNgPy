import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from './services/api/api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);
  if (apiService.getToken()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
