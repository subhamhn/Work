import { Component, OnInit,OnDestroy } from '@angular/core';
import { ContractService } from '../contract.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit ,OnDestroy{
  public id1;

  constructor(private cs:ContractService,private route:Router,private cook:CookieService) { }

  sign_out(){
    console.log("in");
    
    this.cook.delete("privateKey");
    
    this.route.navigate(['login']);
  }
  

  


  ngOnInit() 
  {
    let bank = this;
    bank.id1 = setInterval(function() {
    bank.cs.check_cookie().then(status =>{
      if(status == true)
      { 
        clearInterval(this.interval)
      }
      else
      {
        bank.route.navigate(['login'])
      }
    })
  },50)

}
ngOnDestroy()
{
  if (this.id1) {
    clearInterval(this.id1);
  }
}
}