import { Component, OnInit } from '@angular/core';
import {ContractService} from "../contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent  } from "../app.component";

@Component({
  selector: 'app-loan-req',
  templateUrl: './loan-req.component.html',
  styleUrls: ['./loan-req.component.scss']
})
export class LoanReqComponent implements OnInit {

  angForm: FormGroup;
  add : any;
  address : string;
  balance : number;
  amount : number;
  All_bank2 = [];

  token_address : string;
  bank_address : string;
  token_count : any;
  time : any;



  constructor(private cs: ContractService,private router:Router,private spin : NgxSpinnerService, private fb: FormBuilder,private cook:CookieService) { 
    var ins = new AppComponent(cs,router,spin,cook)
    ins.change()
    this.createForm();
    
  }

  createForm() {
    this.angForm = this.fb.group({
      token_add: ['', Validators.required ],
      bank_add: ['', Validators.required ],
      tok_count: ['', Validators.required ],
      loan_time: ['', Validators.required ],
    });
  }

  ngOnInit() {
    let instance = this;
    this.cs.basicfunctions();
    this.cs.getAccount().then(add =>{
      this.address = add;
    
      this.cs.getUserBalance(add).then(balance =>{
        this.balance = balance;
   
         this.cs.bank_count().then(game =>{
           game.forEach(item => {
            this.cs.bank_address(item).then(add =>{
              if (add != this.address)
                 this.cs.bank_detail(add).then(obj => 
               {
                 if(obj[2] && add != this.address)
               this.All_bank2.push({"address":add,"bank_name":obj[0],"Bal":obj[1]+" Ξ","Loan_int":obj[3]+" %","Fix_dep_int":obj[4]+" %"})
           });
        })
      });
    })
  }) 
}) 

}
 

  submit(){
    let instance =this;
    if(this.token_address.trim()!="" && this.bank_address.trim()!=""){
    if((document.getElementById("check") as HTMLInputElement).checked == true){
     
     
        let meta = this.cs;
        this.spin.show();
        meta.isregister().then(result =>{
          // this.spin.show();null
          if(result == true)
          {        
          meta.loan(this.token_address,this.bank_address,this.token_count,this.time).then((res)=>{
            (document.getElementById("tokenaddress") as HTMLInputElement).value = null;
            (document.getElementById("bankaddress") as HTMLInputElement).value = "";
            (document.getElementById("tokencount") as HTMLInputElement).value = "";
            (document.getElementById("period") as HTMLInputElement).value = "";
            // console.log("Hash :"+res);
            console.log("Working......");
            
            if(res == 0)
              {  
                console.log("working");
                
                this.spin.hide();
                swal("You Rejected this transation");
              }
               else if(res ==1 ){
              instance.spin.hide();
              (document.getElementById("check") as HTMLInputElement).checked =false;
            swal("Success");
           }
            else if (res ==2)
            {
          
              console.log("result : "+ result );  
             
              swal("Failed")
              this.spin.hide();
            }

          })
        }        
          else
          {
          alert("You have not Register");
          }
        })
      }
      else{
        alert("please Approve your token");
      }
    }
    else{
      alert("Fill all details correctly");
    }
  }


loan_approve(logiccontractaddress,tokens,add){
  console.log("loan_approve");
  (document.getElementById("check") as HTMLInputElement).checked = false;
  
this.spin.show();
let meta=this.cs;
this.cs.getAccount().then(address =>{
  //alert(address)
  var tok_add = (document.getElementById("tokenaddress") as HTMLInputElement).value;
  alert(tok_add);
  this.cs.allowance(address,tok_add).then(bal =>{
  //alert(bal);
  var a = parseInt(bal)
  var b = parseInt(tokens)

  var cummulative_tokens:number = a+b;
  
  
  //alert(cummulative_tokens);
   this.cs.Approve(address,cummulative_tokens,tok_add).then(res=>{
  
  if(res == 0)
  {  
    this.spin.hide();
    swal("You Rejected this transation")
  }
  else if (res == 1)
    {
      console.log("result : "+ res );  
      this.spin.hide();
      swal("Success");
      (document.getElementById("check") as HTMLInputElement).checked = true;
    }
    else if(res==2)
    {
      console.log("result : "+ res );  
      this.spin.hide();
      swal("Failed");
      (document.getElementById("check") as HTMLInputElement).checked = false;
    }
   
})
})
})
}
}


