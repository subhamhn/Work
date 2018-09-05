import { Component, OnInit } from '@angular/core';
import {ContractService} from "../contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-fd-amt-settle',
  templateUrl: './fd-amt-settle.component.html',
  styleUrls: ['./fd-amt-settle.component.scss']
})
export class FdAmtSettleComponent implements OnInit {

  angForm: FormGroup;
  public model:{};
  public fix_idowner:number;
  add : any;
  games : any
  address : string;
  balance : number;
  amount : number;
  fix_dep = [];
  pay_due : any;

  constructor(private cs: ContractService, private spin : NgxSpinnerService, private router:Router, private fb: FormBuilder,private cook:CookieService) {
    var ins = new AppComponent(cs,router,spin,cook)
    ins.change()
    this.createForm();
   }

  createForm() {
    this.angForm = this.fb.group({
      fix_idowner: ['', Validators.required ],
    });
  }

  ngOnInit() {
      this. fix_table();

  }

    
    fix_table(){

    this.cs.basicfunctions();
    
    this.cs.my_clients_count().then(game =>{
      game.forEach(item => {
        this.cs.my_clients_dep_id(item).then(add =>{
          this.cs.fix_dep_detail(add).then(obj => 
          {
            if(obj[6])
            this.fix_dep.push({"id":add,"user_add":obj[2],"amt":obj[3]+" Ξ","End_time":obj[4],"status":"Not Settled"})
          });
        })
      });
    })
  }
  

  submit(){
    this.spin.show();
    console.log(this.fix_idowner);
    let meta = this.cs;
    var fix_idowner = (document.getElementById("id1")as HTMLInputElement).value;
    meta.fdowner(fix_idowner).then((res)=>{
      (document.getElementById("id1")as HTMLInputElement).value = '';
      console.log("Hash :"+res);
      if(res == 0)
        {  
          this.spin.hide();
          swal("You Rejectd this transaction")
        }
        else if(res ==1 )
        {
            console.log("kanan");
            
         
            this.spin.hide();
            swal("Success");
            this.fix_table();
        
          }
            else if (res ==2)
            {
          
              console.log("result : "+ res );  
             
              swal("Failed")
              this.spin.hide();
            }

          })
        }
  
  }

