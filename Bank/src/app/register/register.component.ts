import { Component, OnInit ,NgModule} from '@angular/core';
import {ContractService} from "../contract.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { Routes, RouterModule} from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from "../app.component";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  angForm: FormGroup;
  public model:{};
  public bankname:string;
  public fdint:string;
  public lnint:number;
  

  constructor(private cs: ContractService,private router:Router, private spin : NgxSpinnerService,private fb: FormBuilder,private cook:CookieService){
    
      
    var ins = new AppComponent(cs,router,spin,cook)
    ins.change()
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      _bankname: ['', Validators.required ],
      _lnint: ['', Validators.required ],
      _fdint: ['', Validators.required ],
    });
  }
 
  submit(){
  
    let meta = this.cs;
    
    meta.isregister().then(result =>{
      if(result == false){
      this.spin.show();
      meta.register(this.bankname,this.lnint,this.fdint).then((res)=>{
        alert("RESULT"+res);
        
        // (document.getElementById("id1")as HTMLInputElement).value = '';
        // (document.getElementById("id2")as HTMLInputElement).value = '';
        // (document.getElementById("id3")as HTMLInputElement).value = ''; 

        if(res == 0)
          {  
            console.log("helooooooooooooo");
            swal("You Rejected this transaction")
            this.spin.hide();
          }
         else if(res == 1)
         {  this.spin.hide();
            swal("Success");
            
            this.router.navigate(['profile']);
         }
         else if (res == 2)
         {
              console.log("result : "+ result );  
              swal("Failed")
              this.spin.hide();
          }

       })
        }
      else 
      {
      alert("You have registered already");
      this.router.navigate(['profile']);
      }

  })
  }
  
  ngOnInit() {
  
    this.cs.basicfunctions();
  }
   

}
