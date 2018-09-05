import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ContractService } from "./contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
declare let window: any;
import * as Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'app';

  public balance;
public address;

public private_key;
public  _web3: any;
public id1: any;
public id;
public account;
 constructor(private cs:ContractService ,private route:Router, private spin : NgxSpinnerService,private cook:CookieService)
 {
//   cs.getAccount().then(address=>{
//     this.address=address;
//     cs.getUserBalance(address).then(balance => {
//       this.balance = balance;
//   })
// })
 }
 not()
 {
  document.getElementById('navbar').hidden=true;
 }
 change()
 {
  document.getElementById('navbar').hidden=false;
 }


 

ngOnInit() {
  document.getElementById('navbar').hidden=true
}

 

}