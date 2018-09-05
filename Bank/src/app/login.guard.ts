import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ContractService } from "./contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';


@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private cs:ContractService,private route:Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let meta=this;
      return this.cs.check_cookie().then(cookie_exist => {
        if(!cookie_exist)
        {
          return true;
        }
        else if(cookie_exist)
        {
          meta.cs.get_cookie().then(key =>{
            if(key.length != 64)
            {
              return true;
            }
            else{
              meta.cs.getAccount().then(account => {
                meta.cs.isregister().then( result=> {
                  if(result == false){
                    meta.route.navigate(['register'])
                    return false;
                  }
                  else{
                    meta.route.navigate(['profile'])
                    return false;
                  }
                })
              })
            }
          })
        }
      })
    
  }
}
