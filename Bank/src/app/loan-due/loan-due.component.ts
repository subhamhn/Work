import { Component, OnInit } from '@angular/core';
import {ContractService} from "../contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import swal from 'sweetalert'
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from "../app.component";
// import {HttpClient} from '@angular/common/http'
import $ from 'jquery';
import Web3 from 'Web3'

@Component({
  selector: 'app-loan-due',
  templateUrl: './loan-due.component.html',
  styleUrls: ['./loan-due.component.scss']
})
export class LoanDueComponent implements OnInit {

  angForm: FormGroup;
  add : any;
  games : any
  address : string;
  balance : number;
  amount : number;
  Loan_get = [];
  pay_due : any;
  //public _web3;

  constructor(private cs: ContractService, private spin : NgxSpinnerService, private router:Router, private fb: FormBuilder,private cook:CookieService) {
    var ins = new AppComponent(cs,router,spin,cook)
    ins.change()
    this.createForm();
  // $.ajax({
//   url:"https://api.coinmarketcap.com/v2/ticker/1027/",
//   type:'GET',
//   success: function(data){
//     alert(data)
//     console.log(data);
    
//       $('#content').html($(data).find('#content').html());
//   }
// });
   }

  createForm() {
    this.angForm = this.fb.group({
      ln_id: ['', Validators.required ],
    });
  }

  ngOnInit() {
    this.table();
    }

    table(){
    this.Loan_get.length =0;
    this.cs.basicfunctions();

    this.cs.loan_get_count().then(game =>{
    
      game.forEach(item => {
        this.cs.get_loan_id(item).then(add =>{
          this.cs.loan_detail(add).then(obj => 
          {
            if(parseInt(obj[5]) < parseInt(obj[7]))
            this.Loan_get.push({"id":add,"lender_add":obj[1],"amt":obj[4]+" Ξ","settlement":obj[5],"next_settle_time":obj[6],"month":obj[7],"bal_loan":obj[8]+" Ξ","current_inst":obj[11]+" Ξ"})
          });
        })
      });
    })
  }
  
  


  submit(){
    let meta = this;
    var a = (document.getElementById("loanid") as HTMLInputElement).value;
    meta.spin.show();
    meta.cs.pay_due(a).then(re=>{
      if(re == 0)
        {
          (document.getElementById("loanid") as HTMLInputElement).value="";
          meta.spin.hide();
          swal("pay_due Rejected")
        }
        else if(re == 1)
        {
          (document.getElementById("loanid") as HTMLInputElement).value="";
          this.table();
          meta.spin.hide();
          swal("pay_due Success")
        }
        else if(re == 2)
        {
          (document.getElementById("loanid") as HTMLInputElement).value="";
          meta.spin.hide();
          swal("pay_due Reverted")
        }
    })
  }
}


  