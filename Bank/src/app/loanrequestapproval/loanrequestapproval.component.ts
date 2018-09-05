import { Component, OnInit } from '@angular/core';
import {ContractService} from "../contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-loanrequestapproval',
  templateUrl: './loanrequestapproval.component.html',
  styleUrls: ['./loanrequestapproval.component.scss']
})
export class LoanrequestapprovalComponent implements OnInit {
public loan_req_details=[];
public loanid;
public tokenaddress
public requestor;
public tokenamt
public years;


  constructor(private cs: ContractService,private route:Router,private spin : NgxSpinnerService,private cook:CookieService) {
    var ins = new AppComponent(cs,route,spin,cook)
    ins.change()
   }

loan_request_table(){
  this.loan_req_details.length=0;
var meta = this.cs;
meta.getAccount().then(address=>{
meta.loan_id().then(loan_req_ids =>{
   loan_req_ids.forEach(loan_req_id => {
   meta.loan_detail_map(loan_req_id).then(loan_details=>{  
    console.log(loan_req_id+"  "+loan_details[5]);
      if(loan_details[2]==address){  
      if(loan_details[5]==1){
      var obj={}
      obj["loan_id"]=loan_req_id;
      obj["loan_requestor"]=loan_details[0];
      obj["token_address"]=loan_details[1];
      obj["bank_address"]=loan_details[2];
      obj["amount_of_token"]=loan_details[3];
      obj["year"]=loan_details[4];
      this.loan_req_details.push(obj)
     }
    }
  })
    })
   });
  })
}


loanapprove(loan_id,token_address,loan_requestor,amount_of_token,year){
 
var meta=this;
(document.getElementById("loantable")as HTMLInputElement).style.display="none";
(document.getElementById("approve")as HTMLInputElement).style.display="block";
meta.loanid=loan_id;
meta.tokenaddress=token_address;
meta.requestor=loan_requestor;
meta.tokenamt=amount_of_token;
meta.years=year;
//console.log(meta.loanid);
//console.log(meta.tokenaddress);
}

cancel(){
 if( (document.getElementById("check") as HTMLInputElement).checked != true){
  (document.getElementById("approve")as HTMLInputElement).style.display="none";
  (document.getElementById("loantable")as HTMLInputElement).style.display="block";
  }
  
}


loan_req_approval(loan_req_id,tokenadd,loan_requester_address,tokenamt,year,decision){
  this.spin.show();
  var meta = this.cs;

  console.log("decision"+decision);
  meta.loan_req_app(loan_req_id,tokenadd,loan_requester_address,tokenamt,year,decision).then(res=>{
    console.log("checking......");
     
    if(res == 0){
   
    console.log(res);
    this.spin.hide();
    swal("You Rejected this transaction")
    }
    else if(res ==1 )
      {        
        (document.getElementById("check") as HTMLInputElement).checked = true;
        this.spin.hide();
        swal("Success");
        this.loan_request_table();
       }
        else if (res ==2)
        {
          console.log("result : "+ res );  
          swal("Failed")
          this.spin.hide();
        }

      })
    }
  
  
  
    loan_token_approve(tokenaddress,tokencount){
      if( (document.getElementById("check") as HTMLInputElement).checked == true){
      console.log("loan_approve");
      this.spin.show();
      let meta=this.cs;
      this.cs.getAccount().then(address =>{
   
      this.cs.Approve(address,tokencount,address).then(res=>{
        if(res == 0)
        {  
          this.spin.hide();
          console.log("res"+res);
          swal("You Rejected this transation")
        }
        else if(res==1)
          {
            console.log("result : "+ res );  
            (document.getElementById("check") as HTMLInputElement).checked = false;
            this.spin.hide();
            swal("Success");
         
          }
          else if(res==2)
          {
            console.log("result : "+ res );  
            this.spin.hide();
            swal("Failed");
            
          }
        })
      })
      
    }
  }
      
    

  ngOnInit() {
    this.loan_request_table();
  }

}
