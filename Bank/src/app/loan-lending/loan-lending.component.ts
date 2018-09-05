import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {ContractService} from "../contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-loan-lending',
  templateUrl: './loan-lending.component.html',
  styleUrls: ['./loan-lending.component.scss']
})
export class LoanLendingComponent implements OnInit {

  add : any;
  address : string;
  balance : number;
  amount : number;
  Loan_pro = [];


  constructor(private cs: ContractService, private router:Router,private spin:NgxSpinnerService,private cook:CookieService) { 
    var ins = new AppComponent(cs,router,spin,cook)
ins.change()
  }

  ngOnInit() {

   this.cs.basicfunctions();

    this.cs.loan_pro_count().then(game =>{
    
      game.forEach(item => {
        console.log("item"+item);
        
        this.cs.pro_loan_id(item).then(add =>{
          console.log("add"+add);
          this.cs.loan_detail(add).then(obj => 
          {
            if(parseInt(obj[5]) < parseInt(obj[7]))
            this.Loan_pro.push({"id":add,"borrower_add":obj[2],"token_add":obj[3],"amt":obj[4],"settlement":obj[5],"next_settle_time":obj[6],"month":obj[7],"bal_loan":obj[8]+" Ξ","current_inst":obj[9]+" Ξ"})
          });
        })
      });
    })

  }
}
