import { Component, OnInit } from '@angular/core';
import {ContractService} from "../contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert'
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from "../app.component";
       
@Component({
  selector: 'app-fix-dep',
  templateUrl: './fix-dep.component.html',
  styleUrls: ['./fix-dep.component.scss']
})
export class FixDepComponent implements OnInit {

  angForm: FormGroup;
  public model:{};
  public bankaddress:string;
  public depositamount:number;
  public periodinyrs:number;

  add : any;
  address : string;
  balance : number;
  amount : number;
  All_bank1 = [];


  constructor(private cs: ContractService,private route:Router,private spin : NgxSpinnerService, private fb: FormBuilder,private cook:CookieService) { 
    var ins = new AppComponent(cs,route,spin,cook)
ins.change()
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      bankaddress: ['', Validators.required ],
      depositamount: ['', Validators.required ],
      periodinyrs: ['', Validators.required ],
    });
  }


  ngOnInit() {
    this.cs.basicfunctions();

    this.cs.getAccount().then(address => this.address = address)
    // this.cs.getUserBalance().then(balance => this.balance = balance)
    this.cs.bank_count().then(game =>{
    
      game.forEach(item => {
        this.cs.bank_address(item).then(add =>{
          if (add != this.address)
          this.cs.bank_detail(add).then(obj => 
          {
            if(obj[2] && add != this.address)
            this.All_bank1.push({"address":add,"bank_name":obj[0],"Bal":obj[1]+" Ξ","Fix_dep_int":obj[4]+" %"})
          });
        })
      });
    })
  }

  submit(){
    
    let meta = this.cs;
    meta.isregister().then(result =>{
     if(result == true){
      this.spin.show();
     var bankaddress = (document.getElementById("id1")as HTMLInputElement).value;
     var depositamount =  (document.getElementById("id2")as HTMLInputElement).value;
      var periodinyrs = (document.getElementById("id3")as HTMLInputElement).value;
      console.log("outside function.......");
      
     meta.fixeddeposit(bankaddress,depositamount,periodinyrs).then((res)=>{
       console.log("inside function..........");
       
       (document.getElementById("id1")as HTMLInputElement).value = '';
       (document.getElementById("id2")as HTMLInputElement).value = '';
       (document.getElementById("id3")as HTMLInputElement).value = '';
      console.log("Hash :"+res);
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
    else{
      alert("You have not Register");
    }
   })
  }
  
}