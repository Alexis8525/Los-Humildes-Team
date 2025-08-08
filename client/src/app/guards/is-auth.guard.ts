import { CanActivateFn } from '@angular/router';

export const isAuthGuard: CanActivateFn = (route, state) => {
  const isAuth = window.sessionStorage.getItem('_tkn')

  return isAuth ? false : true;
};
