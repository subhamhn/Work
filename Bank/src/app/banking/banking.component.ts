import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert'
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { AppComponent } from "../app.component";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Web3 from 'web3';
@Component({
  selector: 'app-banking',
  templateUrl: './banking.component.html',
  styleUrls: ['./banking.component.scss']
})
export class BankingComponent implements OnInit {
public _web3;
  public model:{};
  public depositadd:number;
  public depositamt:number;
  public withdraw:number;
  account:string;
  public bank_address:number;

  angForm: FormGroup;
  public amount:number;
  public tokenaddress:number;
  public bankaddress:number;

  constructor(private de:ContractService ,private route:Router, private spin : NgxSpinnerService, private fb: FormBuilder,private cook:CookieService) {
    var ins = new AppComponent(de,route,spin,cook)
    ins.change()
    de.getAccount().then(account=> this.account = account);
    this.createForm();
   }

   createForm() {
    this.angForm = this.fb.group({
      amount: ['', Validators.required ],
      withdraw: ['', Validators.required ],
      tokenaddress: ['', Validators.required ],
      bankaddress1: ['', Validators.required ],
      amount1: ['', Validators.required ],
    });
  }

  ngOnInit() {
    this.de.basicfunctions();

  }
  dep(){
    this.spin.show();
    let meta = this.de;
    meta.isregister().then(result =>{
      if(result == true){

        var amount = (document.getElementById("id1")as HTMLInputElement).value

        meta.deposit(amount).then((res)=>{

          (document.getElementById("id1")as HTMLInputElement).value = '';
          this.spin.hide();
          if(res == 0)
          {  
            this.spin.hide();
            swal("You Rejected this Transaction")
          }
          else if(res ==1 ){
                this.spin.hide();
                swal("Success");
              }
              else if (res ==2)
              {
                console.log("result : "+ result );  
                swal("Failed")
                this.spin.hide();
              }
        });
      }
      else
        alert("You have not Register");
    })
  }

  
  wit(){
    this.spin.show();
    let meta = this.de;
    meta.acc_bal().then(result =>{
      var with_amount = parseInt((document.getElementById("id2")as HTMLInputElement).value);
      if(parseInt(result) >= with_amount)

        meta.withdraw(with_amount*1000000000000000000).then((res)=>{
          (document.getElementById("id2")as HTMLInputElement).value = '';
          // this.spin.hide();
          console.log("Hash :"+res);
        if(res == 0)
        {  
          console.log("result : "+ result );  
          swal("You Rejected this Transaction")
          this.spin.hide();
        }
        else if(res ==1 ){
            this.spin.hide();
            swal("Success");
          }
          else if (res ==2)
          {
            console.log("result : "+ result );  
            swal("Failed")
            this.spin.hide();
         }
     });
     else
        {
        console.log(result)
        alert("You have a not enough balance");
        this.spin.hide();
        }
      })
  }
  
  token(){
    this.spin.show();
    let meta = this.de;
    meta.isregister().then(result =>{
      if(result == true)
      {
      var token_addr = (document.getElementById("id3")as HTMLInputElement).value;
      //alert(token_addr)
      
      meta.token(token_addr).then((res)=>
      {
        (document.getElementById("id3")as HTMLInputElement).value = '';
        console.log("Hash :"+res);
        if(res == 0)
        {  
          swal("You Rejected this Transaction")
          this.spin.hide();
        }
        else if(res==1)
        {
        console.log("result : "+ result );  
        swal ("Success")
          this.spin.hide();
        }
        else if(res==2)
        {
          swal("Failed")
          this.spin.hide();
        }
      })
    }
      else
      alert("You have not Register");
    })
  }
  
  trans(){
    this.spin.show();
    let meta = this.de;
    meta.acc_bal().then(result =>{
      //alert("res"+result)
      var amount =  parseInt((document.getElementById("id4")as HTMLInputElement).value);
      var address = (document.getElementById("id5")as HTMLInputElement).value;

      if(result >= "amount")
      {  
      meta.transfer(address,amount).then((res)=>{
        console.log("Hash :"+res);
        
      (document.getElementById("id4")as HTMLInputElement).value = '';
      (document.getElementById("id5")as HTMLInputElement).value = '';
        if(res == 0)
        { 
          swal("You Rejectdthid Transaction")
          this.spin.hide();
        }
        else if(res==1)
          {
          console.log("result : "+ result );  
          swal("Success")
            this.spin.hide();
          }
          else if(res==2)
          {
            swal("Failed")
            this.spin.hide();    
          } 
        })
      }
      else
      {
        alert("You have a not enough balance");
        this.spin.hide();
      }
        
    })
  }
}
