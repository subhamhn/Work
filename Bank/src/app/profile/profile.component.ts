import { Component, OnInit } from '@angular/core';
import { ContractService } from "../contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { CookieService } from 'ngx-cookie-service';

    
            
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  add: any;
  address: any = "Hai";
  status: string;
  balance: number;
  amount: number;
  All_bank = [];
  My_Bank = [];

  temp_bending_count : number = 0;
  temp_exp_count : number = 0;




  constructor(private cs: ContractService, private router:Router, private spin : NgxSpinnerService,private cook:CookieService) 
  {
    var ins = new AppComponent(cs,router,spin,cook)
    ins.change()

   }


  ngOnInit() {  

    this.cs.basicfunctions();

    this.cs.isregister().then(result => { if (result == false) this.status = "Not Registered"; else this.status = "Registered"; })

     this.cs.getAccount().then(add =>{
      this.address =add;

      
      this.cs.getUserBalance(add).then(bal =>{
        this.balance = bal;
      
     
    
  
    
    var meta = this.cs;
    var meta1=this
    var accountInterval = setInterval(function()
    {
      meta.getUserBalance(add).then(bal => {
        if(bal !== meta1.balance)
        {
          meta1.balance = bal;
        }
      })
    }, 10000);

       this.cs.bank_count().then(game => {
      game.forEach(item => {
        this.cs.bank_address(item).then(add => {
          // if (add != this.address)
            this.cs.bank_detail(add).then(obj => {
              if(obj[2])
              if (add != this.address)
                this.All_bank.push({ "address": add, "broker_name": obj[0], "Bal": obj[1] + " Ξ", "token_count": obj[5], "lend_amt": obj[7]/1000000000000000000 + " Ξ", "fix_amt_bank": obj[8] + " Ξ", "fix_amt_user": obj[9] + " Ξ", "borrow_amt": obj[6] + " Ξ", "Loan_int": obj[3] + " %", "Fix_dep_int": obj[4] + " %"})
              else
                this.My_Bank.push({ "address": add, "broker_name": obj[0], "Bal": obj[1] + " Ξ", "token_count": obj[5], "lend_amt": obj[7] + " Ξ", "fix_amt_bank": obj[8] + " Ξ", "fix_amt_user": obj[9] + " Ξ", "borrow_amt": obj[6] + " Ξ", "Loan_int": obj[3] + " %", "Fix_dep_int": obj[4] + " %"})
            });
        })
      });
    })

    this.cs.loan_get_count().then(game =>{
    
      game.forEach(item => {
        this.cs.get_loan_id(item).then(add =>{
          this.cs.loan_detail(add).then(obj => 
          {
            let time = Math.round((new Date()).getTime() / 1000);

            if(obj[8] == 0)
              return;              

            if(time >= (parseInt(obj[10])-60))
            {
              if( ((parseInt(obj[10])-60) <= time) && (time <= parseInt(obj[10])))
              {
                      this.temp_bending_count ++;
              }
              else
              {
                      this.temp_exp_count++;
              }
            }
            
           
          });
        })
      });
    })
  })
})
  }

  submit() {
   
    let meta = this.cs;
    meta.isregister().then(result => {
      if (result == true){
      this.spin.show();
      meta.deregister().then((res) => {
        // console.log("Hash :"+res);
        if(res == 0)
          { 
            console.log("dasdfg");
            swal("You Rejected this transaction");
            this.spin.hide();
          }
          else{
          meta.hash(res).then((result) => 
          // console.log("qwert")
          
          {
            if(result ==1 ){
            
         
            swal("Success")
            // this.router.navigate(['register']);
            this.spin.hide();

            }
            else if (result ==2)
            {
              swal("Failed")
              console.log("result : "+ result );  
              this.spin.hide();
            }

          })
        }
        });
      
      }
      else
        alert("You have not registered");
    })
  }


}
