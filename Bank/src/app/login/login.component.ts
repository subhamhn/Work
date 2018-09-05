import { Component, OnInit } from '@angular/core';
import { ContractService } from "../contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public canshow:boolean;
  public account;
  constructor(private cs: ContractService, private route:Router, private spin : NgxSpinnerService,private cook: CookieService ) {
    
    var ins = new AppComponent(cs,route,spin,cook)
    ins.not()
   }


  fetch_account(private_key)
  {   
    if(private_key.length == 64)
    {
      this.cs.set_cookie(private_key).then(is_exist => {
        if(is_exist){
          this.cs.getAccount().then(account => {
            this.account = account;
            this.canshow=true;
          })
        }
      });
    }
    else 
    {
      alert("Invalid Key")
    } 
  }
  validate()
  {
    
    if((document.getElementById('verify') as HTMLInputElement).checked != false )
    {
      this.cs.isregister().then(result =>{
        if(result == true)
        {
        this.route.navigate(['profile'])
        }
        else
        {
        this.route.navigate(['register'])
        }
    })
  }
    else
    {
      alert('Please Verify your Account')
    }
  }


  ngOnInit() {
  }

}
