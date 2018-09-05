import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { promise } from 'protractor';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';


import {CookieService} from 'ngx-cookie-service';
import * as Tx from 'ethereumjs-tx';
let Buffer = require('buffer/').Buffer;

declare let require: any;
declare let window: any;

let contractAbi = require('./contract.json');
let approveAbi = require('./token.json');

@Injectable()
export class ContractService {

  private _account: string = null;
  private _balance: number = 0;
  private _web3: any;
  public tokenApprove:string;
  public _tokenContract: any;
  private _tokenContractAddress: string ="0x7686c5cb0e3f9fde6cd82cbb01a0e0f0120fe119"; //logic
  private approveContract:any;//0xec4b6faa91a1d878901923fdfae5cd6a13f2df60
  private token_address :string = "0xd145a91a7c5232b6ada604593cd675acb16d8053"; //token
   
  constructor(private cook:CookieService) { 
    
    
    // this._web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Vr1GWcLG0XzcdrZHWMPu'));  //window.web3.currentProvider
      // this.supply_contract = new this._web3.eth.Contract(contractAbi,this.supply_contract_address,{gaslimit:3000000});
     
       this._web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Vr1GWcLG0XzcdrZHWMPu'));  //window.web3.currentProvider
       this._tokenContract = new this._web3.eth.Contract(contractAbi,this._tokenContractAddress,{gaslimit:3000000});
      
       //this.approveContract = new this._web3.eth.Contract(approveAbi,this.token_address,{gaslimit:3000000});
    }

  public async set_cookie(privatekey):Promise<boolean> {
    console.log('inside cookie');
    
    let instance = this;
    instance.cook.set('privatekey',privatekey);
    return new Promise<boolean>((resolve,reject)=> {
    instance.check_cookie().then(is_cookie =>{
      console.log('cookie'+ is_cookie);
      
      resolve(is_cookie);
    })
    })as Promise<boolean>
  }

  public async get_cookie():Promise<string> {
    let instance = this;
    return new Promise<string>((resolve,reject) => {
      var key = instance.cook.get('privatekey'); 
      resolve(key);
    })as Promise<string>;
  }

  public async check_cookie():Promise<boolean>{
    let instance = this;
    return new Promise<boolean>((resolve,reject) => {
      var state = instance.cook.check('privatekey');
      
      if(state == true)
      {
        resolve(true)
      }
      else
      {
        resolve();
      }
    })as Promise<boolean>;
  }

  public async delete_cookie(): Promise<boolean>{
    let instance = this;
    this.cook.delete('privateKey');
    return new Promise<boolean>((resolve,reject)=>{
      instance.check_cookie().then(is_exist => {
        resolve(!is_exist);
      });
    }) as Promise<boolean>;
  }


  public async basicfunctions(): Promise<string> {
    let meta = this;
    let account = await meta.getAccount();
    var accountInterval = setInterval(function()
    {
      meta._web3.eth.getAccounts((err, accs) => {
        if(accs[0] !== meta._account)
        {
          // console.log("Met : "+accs[0]+", acc : "+meta._account);
          // window.location.reload();
        }
      })
      
    }, 100);

  return Promise.resolve(this._account);
  }

  public async hash(a): Promise<any> {
    let meta = this;
    return new Promise((resolve, reject) => {

      var accountInterval = setInterval(function()
      {
        meta._web3.eth.getTransactionReceipt(a,function(err,result){
          if(err != null) {
            // console.log("rev null");
            
          resolve(false);
          }

          if(result !== null)
          {
            console.log(result.status)
            clearInterval(accountInterval);
            if(result.status == 0x1)
            {
                resolve(true);
            }
            else
            {
              // console.log("reverted");              
                resolve(false);
            }
          }
        })
      },100)
    }) as Promise<any>;
  }
  
public async getAccount(): Promise<string> {                                       
  let instance = this;
  let account_adddress:string;
  return new Promise((resolve, reject) => {
    instance.get_cookie().then(private_key => {
      account_adddress = instance._web3.eth.accounts.privateKeyToAccount('0x'+private_key);
      resolve(account_adddress["address"]);
    })
  }) as Promise<string>;
}

public async getuserBalance(): Promise<number> {
    let instance = this;
    return new Promise((resolve, reject) => {
      instance.getAccount().then(address => {
      instance._web3.eth.getBalance(address,function(err,result){
        if(err != null) {
          reject(err);
        }
        else{
          resolve(instance._web3.utils.fromWei(result,'ether'));
        }
      })
    })
    }) as Promise<number>;
  }

  public async getUserBalance(account): Promise<number> {
    let instance = this;
    return new Promise((resolve, reject) => {
      instance._web3.eth.getBalance(account,function(err,result){
        if(err != null) {
          reject(err);
        }
        else{
          resolve(instance._web3.utils.fromWei(result,'ether'));
        }
      })
    }) as Promise<number>;
  }
  
   // Bank Table
public async bank_count(): Promise<number[]> {
   let instance = this;
    return new Promise((resolve, reject) => {
      instance._tokenContract.methods.bank_count().call(function (err,result) {
        if(err !=null){
          reject(err);
        }
        else{
          // alert(result)
          const arr:number[] = [];
          for(var i=0;i< result;i++){
              arr.push(i);
          }
          resolve(arr);
        }
      });
    })as Promise<number[]>;
  }

public async loan_id(): Promise<number[]> {
   let instance = this;
    return new Promise((resolve, reject) => {
      instance._tokenContract.methods.loan_req_id().call(function (err,result) {
        if(err != null){
          reject(err);
        }
        else{
          const arr:number[] = [];              
          for(var i=1;i<= result;i++){            
             arr.push(i);
          }
          resolve(arr);
        }
      });
    })as Promise<number[]>;
  }

  public async bank_address(bank_count):Promise<any> 
  {
    let instance = this;
    return new Promise((resolve, reject) => 
    {
      instance._tokenContract.methods.bank_users(bank_count).call(function (error,result) {
      if(error!=null){    
           reject(error); 
          } 
          else{
            resolve(result);
          }
      });
    })as Promise<any>;
  }

  public async bank_detail(bank_address):Promise<object> 
  {
    return new Promise((resolve, reject) => 
    {
      let _web3 = this._web3;
      let instance = this;
      instance._tokenContract.methods.bank(bank_address).call(function (error,result) {
      if(error){    
        reject(error); 
      } 
          result[0] = _web3.utils.toAscii(result[0])
          result[3] = parseInt(result[3])/100;
          result[4] = parseInt(result[4])/100;
          // if(result[2] == false)
          //   result[2] = "Not Available"
          // else
          //   result[2] = "Available"
          result[1] = _web3.utils.fromWei(result[1],'ether')
          result[6] = _web3.utils.fromWei(result[6],'ether')
          result[7] = _web3.utils.fromWei(result[7],'ether')
          result[8] = _web3.utils.fromWei(result[8],'ether')  
          result[9] = _web3.utils.fromWei(result[9],'ether')                  
          resolve(result);
      });
    })as Promise<object>;
  }

    // Bank Table
   public async loan_get_count(): Promise<number[]> {
     let instance = this;
      return new Promise((resolve, reject) => {
        instance.getAccount().then(address => {
        instance._tokenContract.methods.loan_get_count(address).call(function (error,result) {
          
          const arr:number[] = [];
            for(var i=0;i< result;i++){
              // console.log("count : "+i);
                arr.push(i);
            }
            resolve(arr);
         });
        })
      })as Promise<number[]>;
    }

    public async loan_pro_count(): Promise<number[]> {
     let meta =this;
      return new Promise((resolve, reject) => {
        meta.getAccount().then(address => {
        meta._tokenContract.methods.loan_pro_count(address).call(function (error,result) {
          if(error !=null)
          {
            reject(error);
          }
          else{
            const arr:number[] = [];
            for(var i=0;i< result;i++){
              arr.push(i);
            }
            resolve(arr);
          }
       });
      })
      })as Promise<number[]>;
    }
  
  public async get_loan_id(gid):Promise<any> {
    let account = await this.getAccount();
    return new Promise((resolve, reject) => 
    { 
      this._tokenContract.methods.loan_get_id(account,gid).call(function (error,result) {
        if(error){    
            reject(error); 
          } 
          else{
            resolve(result);
          }
        });
    })as Promise<any>;
  }

  public async pro_loan_id(gid):Promise<any> 
  {
    let account = await this.getAccount();
   
    return new Promise((resolve, reject) => 
    {
      this._tokenContract.methods.loan_pro_id(account, gid,).call(function (error,result) {
        
          if(error){    
            reject(error); 
          } 
          else{
            resolve(result);
          }
        });
    })as Promise<any>;
  }

  
  public async loan_count(gid):Promise<any> 
  {
    let account = await this.getAccount();
   
    return new Promise((resolve, reject) => 
    {
      this._tokenContract.methods.loan_count(account, gid).call(function (error,result) {
         if(error){    
            reject(error); 
          } 
         else{
          resolve(result);
         }
      });
    })as Promise<any>;
  }
 
  public async loan_detail(gid):Promise<object> 
  {
    return new Promise((resolve, reject) => 
    {
     let _web3 = this._web3;
        this._tokenContract.methods.loan(gid).call(function (error,result) {
          
          if(error){    
            reject(error); 
          } 
          let time = Math.round((new Date()).getTime() / 1000);

          result[4] = _web3.utils.fromWei(result[4],'ether')
          result[10] = result[6];
          result[12] = result[9];
          let myDate = new Date( (result[6]) *1000);
          result[6]=(myDate.toLocaleString());
          result[8] = _web3.utils.fromWei(result[8],'ether')
          result[9] = _web3.utils.fromWei(result[9],'ether')

          if(time > parseInt(result[10]))
            result[11] = parseFloat(_web3.utils.fromWei(result[12],'ether')) + 0.01;
          else
            result[11] = _web3.utils.fromWei(result[12],'ether')

          resolve(result);
      });
    })as Promise<object>;
  }

  public async my_fix_acc_count(): Promise<number[]> {
    let instance = this;
    let account = await this.getAccount();
     return new Promise((resolve, reject) => {
      instance._tokenContract.methods.my_fix_acc_count(account).call(function (error,result) {
        if(error !=null)
        {
          reject(error);
        }
        else{
          const arr:number[] = [];
          for(var i=0;i< result;i++){
            arr.push(i);
          }
          resolve(arr);
        }
     });
    })as Promise<number[]>;
  }

  public async my_clients_count(): Promise<number[]> {
    let account = await this.getAccount();
    let instance = this;
    
    return new Promise((resolve, reject) => {
        instance._tokenContract.methods.my_clients_count(account).call(function (error,result) {
        if(error != null)
        {
          reject(error);
        }
        else{
          const arr:number[] = [];
          for(var i=0;i< result;i++){
            arr.push(i);
          }
          resolve(arr);
        }
      });
    })as Promise<number[]>;
  }

  public async my_fix_dep_id(gid):Promise<any> 
  {
    let account = await this.getAccount();
    let _web3 = this._web3;
    return new Promise((resolve, reject) => 
    { 
      this._tokenContract.methods.my_fix_dep_id(account, gid).call(function (error,result) {
        if(error != null){    
            reject(error); 
          } 
        else
         {
            resolve(result);
         }
      });
    })as Promise<any>;
  }

  public async my_clients_dep_id(gid):Promise<any> 
  {
    let account = await this.getAccount();
  
    return new Promise((resolve, reject) => 
    {
      this._tokenContract.methods.my_clients_dep_id(account, gid).call(function (error,result) {
        
          if(error){    
            reject(error); 
          } 
          else
          {
            resolve(result);
          }
        });
    })as Promise<any>;
  }

  public async fix_dep_detail(gid):Promise<object> 
  {
    return new Promise((resolve, reject) => 
    {
      let a = this._tokenContract;
      let _web3 = this._web3;

        this._tokenContract.methods.fix_dep(gid).call(function (error,result) {
          
          if(error != null){    
            reject(error); 
          } 
          else{
            result[3] = _web3.utils.fromWei(result[3],'ether')
            let myDate = new Date( (result[4]) *1000);
            result[4]=(myDate.toLocaleString());
            
            resolve(result);
          }
        });
    })as Promise<object>;
  }

  public async loan_detail_map(Loanid): Promise<object> {
    let instance = this;
    return new Promise((resolve,reject) => {
      instance._tokenContract.methods.loan_req_details(Loanid).call(function(err,result) {
        if(err != null){
          reject(err);
        }
        else{
          resolve(result)
        }
      });
    }) as Promise<object>;
  } 

  public async isregister():Promise<boolean>{
    let meta = this;
    let account = await this.getAccount();
    return new Promise((resolve, reject) => {
      meta._tokenContract.methods.bank(account).call(function (err, result) {
        if(err != null)
        {
          reject(err);
        }
        else
        {
          resolve(result[2]);
        }
      });
    }) as Promise<boolean>;
  }

  public async acc_bal():Promise<string>{
    let meta = this;
    let account = await this.getAccount();
    return new Promise((resolve, reject) => {
       let _web3 = this._web3;
       meta._tokenContract.methods.bank(account).call(function (err, result) {
        if(err != null) {
          reject(err);
        }
        else
        {
          resolve((_web3.utils.fromWei(result[1],"ether")));
        }
    
      });
    }) as Promise<string>;
    
  }


  public async token(token_address): Promise<number> {
    let meta =this;
     return new Promise((resolve, reject) => {
        meta.getAccount().then(address => {
          meta._web3.eth.getTransactionCount(address,function(err,result){
            var nonce = result.toString(16);
              meta.get_cookie().then(private_key => {
              const privatekey = Buffer.from(private_key,'hex');
              var contract_function = meta._tokenContract.methods.tok_count(token_address,address);
              var contract_function_abi = contract_function.encodeABI();
              var tx_params = {
                nonce: '0x' +nonce,
                gasPrice:  '0x4A817C800',
                gasLimit: 4000000,
                from :address,
                to:meta._tokenContractAddress,
                value: '0x00',
                data: contract_function_abi
            }
            var tx = new Tx(tx_params);
            tx.sign(privatekey);
            const serializedtx = tx.serialize();
            meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                if(err != null)
                {
                  resolve(0);
                }
                else{
                    meta.hash(result).then(res => {
                      if(res == true)
                      {
                        resolve(1);
                      }
                      else if(res == false)
                      {
                        resolve(2);
                      }
                    })
                   }
                })
              })
             })
            }) 
          })as Promise<number>;
        }
      
     
  public async register(bank_name,loan_int,fix_int): Promise<number> {
    let instance =this;
    return new Promise((resolve,reject) => {
      instance.getAccount().then(address => {
      instance._web3.eth.getTransactionCount(address,function(err,result){
        var nonce = result.toString(16);
        instance.get_cookie().then(private_key => {
          const privatekey = Buffer.from(private_key,'hex');
          var contract_function = instance._tokenContract.methods.register(instance._web3.utils.fromAscii(bank_name),loan_int,fix_int);
          var contract_function_abi = contract_function.encodeABI();
          var tx_params = {
              nonce: '0x' +nonce,
              gasPrice:  '0x4A817C800',
              gasLimit: 4000000,
              from :address,
              to:instance._tokenContractAddress,
              value: '0x00',
              data: contract_function_abi
          }
          var tx = new Tx(tx_params);
          tx.sign(privatekey);
          const serializedtx = tx.serialize();
          instance._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
              if(err != null)
              {
                resolve(0);
              }
              else{
                //alert(result)
                console.log(result);
                
                instance.hash(result).then(res => {
                    if(res == true)
                    {
                      resolve(1);
                    }
                    else if(res == false)
                    {
                      resolve(2);
                    }
                })
              }
          })
        })
      })
    })
    })as Promise<number>
  }


  public async deregister(): Promise<number> {
    let instance = this;

    return new Promise((resolve,reject) => {
      instance.getAccount().then(address => {
      instance._web3.eth.getTransactionCount(address,function(err,result){
        var nonce = result.toString(16);
        instance.get_cookie().then(privatekey => {
          const private_key = Buffer.from(privatekey,'hex');
          var contract_function = instance._tokenContract.methods.deregister();
          var contract_function_abi = contract_function.encodeABI();
          var tx_params = {
            nonce: '0x' +nonce,
            gasPrice:  '0x4A817C800',
            gasLimit: 4000000,
            from :address,
            to:instance._tokenContractAddress,
            value: '0x00',
            data: contract_function_abi
          }
          var tx = new Tx(tx_params);
          tx.sign(private_key);
          const serializedtx = tx.serialize();
          instance._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
            if(err != null)
            {
              resolve(0);
            }
            else{
              instance.hash(result).then(res => {
                  if(res == true)
                  {
                    resolve(1);
                  }
                  else if(res == false)
                  {
                    resolve(2);
                  }
              })
            }
          })
        })
      })
    })
     })as Promise<number>
  }

  
  public async allowance(address,tok_add): Promise<string> {
    
    console.log("in service");
    let instance = this;
    return new Promise((resolve,reject) =>{
    instance.approveContract = new instance._web3.eth.Contract(approveAbi,tok_add,{gaslimit:3000000});
    instance.approveContract.methods.allowance(address,"0x7686c5cb0e3f9fde6cd82cbb01a0e0f0120fe119").call(function(err,res){
    //alert("NEw"+res)
    resolve(res)
  })
    }) as Promise<string>
  }
 

  public async Approve(address,tokens,tok_add): Promise<number> {
    console.log("in service");
    let instance = this;

    return new Promise((resolve,reject) =>{
      instance._web3.eth.getTransactionCount(address,function(err,result){
        var nonce = result.toString(16);
        instance.get_cookie().then(privatekey => {
        const private_key = Buffer.from(privatekey,'hex');
        var Token_contract ="0x7686c5cb0e3f9fde6cd82cbb01a0e0f0120fe119";
        instance.approveContract = new instance._web3.eth.Contract(approveAbi,tok_add,{gaslimit:3000000});
        var contract_function = instance.approveContract.methods.approve(Token_contract,tokens);
        //alert(tokens)      
        var contract_function_abi = contract_function.encodeABI();
        var tx_params = {
          nonce: '0x' +nonce,
          gasPrice:  '0x4A817C800',
          gasLimit: 4000000,
          from :address,
          to:instance.token_address,
          value: '0x00',
          data: contract_function_abi
      }
      //alert("working...")
        var tx = new Tx(tx_params);
        tx.sign(private_key);
        //alert("work2....")
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
          if(err != null)
          {

            console.log("err != null");
            console.log(err)
            resolve(0);
          }
          else{
            console.log("result is "+result);
            
            instance.hash(result).then(res => {
                if(res == true)
                {
                  resolve(1);
                }
                else if(res == false)
                {
                  resolve(2);
                }
            })
          }
        })
          
        })
      })
    })as Promise<number>
  }

 
          
        
  public async loan(a,b,c,d): Promise<number> {
    let meta = this;
   
    return new Promise((resolve, reject) =>{
       let _web3 = this._web3;
       meta.getAccount().then(address => {
      if(b == address)
      {
          alert("Change the bank Address");
          resolve(0);
          return;
      }

      if(parseInt(c) != c || parseInt(c) <= 0)
      {
          alert("Enter the Valid Token Count...");
          resolve(0);
          return;
      }

      if(parseInt(d) == 0)
      {
          alert("Enter the Valid number of years");
          resolve(0);
          return;
      }

      if(parseInt(d) != d)
      {
          alert("Change the decimal values, You have only deposit the complete number of years");
          resolve(0);
          return;
      }
      meta._web3.eth.getTransactionCount(address,function(error,result){
        var nonce = result.toString(16);
        meta.get_cookie().then(privatekey => {
          const private_key = Buffer.from(privatekey,'hex');
          var contract_function = meta._tokenContract.methods.loan_req(a,b,c,d);
          var contract_function_abi = contract_function.encodeABI();
          var tx_params = {
            nonce: '0x' +nonce,
            gasPrice:  '0x4A817C800',
            gasLimit: 4000000,
            from :address,
            to:meta._tokenContractAddress,
            value: '0x00',
            data: contract_function_abi
           }
           var tx = new Tx(tx_params);
           tx.sign(private_key);
           const serializedtx = tx.serialize(); 
           meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
             if(err != null)
              {
                  resolve(0);
              }
              else
              {
                  meta.hash(result).then(res => {
                    if(res == true)
                    {
                      resolve(1);
                    }
                   else if(res == false)
                   {
                      resolve(2);
                   }
                 })
               }
             })
           })
        })
     });
  }) as Promise<number>;
}
           
  
 public async loan_req_app(loan_req_id,tokenadd,loan_requester_address,tokenamt,year,decision): Promise<number> {
   let _web3 = this._web3;
   let meta = this;
   return new Promise((resolve,reject) => {
      meta.getAccount().then(address => {
        meta._web3.eth.getTransactionCount(address,function(error,result){
            var nonce = result.toString(16);
           meta.get_cookie().then(privatekey => {
            const private_key = Buffer.from(privatekey,'hex');
            var contract_function = meta._tokenContract.methods.approve_loan(loan_req_id,tokenadd,loan_requester_address,tokenamt,year,decision);
            var contract_function_abi = contract_function.encodeABI();
            var tx_params = {
              nonce: '0x' +nonce,
              gasPrice:  '0x4A817C800',
              gasLimit: 4000000,
              from :address,
              to:meta._tokenContractAddress,
              value: '0x00',
              data: contract_function_abi
             }
             var tx = new Tx(tx_params);
             tx.sign(private_key);
             const serializedtx = tx.serialize(); 
             meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
               if(err != null)
                {
                    resolve(0);
                }
                else
                {
                    meta.hash(result).then(res => {
                      if(res == true)
                      {
                        resolve(1);
                      }
                     else if(res == false)
                     {
                        resolve(2);
                     }
                   })
                  }
                })
              })
            })
         })
   }) as Promise<number>;
}

public async loan_map(a): Promise<object>{
  return new Promise((resolve,reject) => {
    this._tokenContract.methods.loan(10).call(function(error, result){
      if(error)
      {
        console.log(error);
      }
      else if(result){
        resolve(result)
        
      }
  })
}) as Promise<object>
}

public async pay_due(a): Promise<number>{
  let meta = this;
  let _web3 = this._web3;
  console.log("inservice.....");
  
  return new Promise((resolve,reject) => {
      meta.getAccount().then(address => {
       meta._tokenContract.methods.loan(a).call(function(err,value){
            console.log(value[9]);
            console.log(typeof(value[5]));
            console.log(typeof(value[7]));
            if(value[2] != address)
            {
            alert("Invalid ID");
            resolve(0);
            return;
            }
            if( (parseInt(value[5]))>= (parseInt(value[7])))
            {
                alert("You have already settle this loan");
                resolve(0);
                return;
            }
            let time = Math.round((new Date()).getTime() / 1000);

            if(time < (value[6]-60))
            {
                alert("Due time can't come");
                resolve(0);
                return;
            }
            //alert(value[6]-60)
            if( value[5] < (value[7]-1) )
            {
              if( (value[6]-60) <= time && time <= value[6])
               {
                console.log("first if");
                
                meta.acc_bal().then(res => {
                  if(_web3.utils.toWei(res, "ether") < parseInt(value[9]))
                  {
                    alert("You have a not enough balance");
                    resolve(0);
                    return;
                  } 
                  meta._web3.eth.getTransactionCount(address,function(error,result){
                    var nonce = result.toString(16);
                   meta.get_cookie().then(private_key => {
                    var privatekey = Buffer.from(private_key,'hex');
                    var contract_function = meta._tokenContract.methods.loan_due(a,value[9]);
                    var contract_function_abi = contract_function.encodeABI();
                    var tx_params = {
                      nonce: '0x' +nonce,
                      gasPrice:  '0x4A817C800',
                      gasLimit: 4000000,
                      from :address,
                      to:meta._tokenContractAddress,
                      //value: value[9],
                      data: contract_function_abi
                     }
                     var tx = new Tx(tx_params);
                     tx.sign(privatekey);
                     const serializedtx = tx.serialize(); 
                     meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                       if(err != null)
                        {
                            resolve(0);
                        }
                        else
                        {
                            meta.hash(result).then(res => {
                              if(res == true)
                              {
                                resolve(1);
                              }
                             else if(res == false)
                             {
                                resolve(2);
                             }
                           });
                          }
                        })
                      })
                    })
                  })
               }
            
        else
        {
          // console.log("first else");
          
          let amt = (parseInt(value[9])) + parseInt(_web3.utils.toWei('0.01', "ether"));
          meta.acc_bal().then(res => {
            var temp:string = res;
            var val =_web3.utils.toWei( temp, "ether");
            
            if(val < amt)
              {
                alert("You have a not enough balance");
                resolve(0);
                return;
              }
              meta._web3.eth.getTransactionCount(address,function(error,result){
              var nonce = result.toString(16);
              meta.get_cookie().then(private_key => {
              const privatekey = Buffer.from(private_key,'hex');
              var contract_function = meta._tokenContract.methods.loan_due(a,amt);
              
              // alert("id is"+a);
              // alert("amt"+amt);
              var contract_function_abi = contract_function.encodeABI();
              const gasPriceHex = _web3.utils.toHex(10);

                var tx_params = {
                  nonce: '0x' +nonce,
                  gasPrice:  '0x4A817C800',
                  gasLimit: 4000000,
                  from :address,
                  to:meta._tokenContractAddress,
                  // value: amt,
                  data: contract_function_abi
              }
                  var tx = new Tx(tx_params);
                  tx.sign(privatekey);
                  const serializedtx = tx.serialize(); 
                  meta._web3.eth.sendSignedTransaction('0x'+ serializedtx.toString('hex'),function(err,result){
                  if(err != null)
                    {
                      // alert(err)
                      console.log(err)
                        resolve(0);
                    }
                    else
                    {       
                    meta.hash(result).then(res => {
                      if(res == true)
                      {
                        resolve(1);
                      }
                      else if(res == false)
                      {
                        resolve(2);
                      }
                    })
                  }
                })
            })
          })
        })

    }
  }
          else if(value[5] == (value[7]-1))
            {
              // console.log("second if");
              
              if( (value[6]-60) <= time && time <= value[6])
              {
                let amt = parseInt(value[9]) + ( parseInt(value[8]) - (parseInt(value[4]) / parseInt(value[7]) ));
                meta.acc_bal().then(res =>{
                  // console.log("lastloan if part called");
                        
                      
                  if(_web3.utils.toWei('res', "ether") < amt)
                  {
                    alert("You have a not enough balance");
                    resolve(0);
                    return;
                  }
                  meta._web3.eth.getTrasactionCount(address,function(error,result){
                  var nonce = result.toString(16);
                   meta.get_cookie().then(private_key => {
                    var privatekey = Buffer.from(private_key,'hex');
                    var contract_function = meta._tokenContract.methods.last_loan_due(a,amt);
                    var contract_function_abi = contract_function.encodeABI();
                    var tx_params = {
                      nonce: '0x' +nonce,
                      gasPrice:  '0x4A817C800',
                      gasLimit: 4000000,
                      from :address,
                      to:meta._tokenContractAddress,
                      //value: '0x00',
                      data: contract_function_abi
                     }
                     var tx = new Tx(tx_params);
                     tx.sign(privatekey);
                     const serializedtx = tx.serialize(); 
                     meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                       if(err != null)
                        {
                            resolve(0);
                        }
                        else
                        {
                        meta.hash(result).then(res => {
                          if(res == true)
                          {
                            resolve(1);
                          }
                          else if(res == false)
                          {
                            resolve(2);
                          }
                        })
                      }
                    })
                  })
                })
            })
          }
              
              
            else{
              let amt1 = (parseInt(value[9])) + parseInt(_web3.utils.toWei('0.01', "ether"));
             let amt = amt1 + ( parseInt(value[8]) - (parseInt(value[4]) / parseInt(value[7])) );
              meta.acc_bal().then(res => {
                if(_web3.utils.toWei(res, "ether") < amt)
                {
                  alert("You have a not enough balance");
                  resolve(0);
                  return;
                }
                meta._web3.eth.getTransactionCount(address,function(error,result){
                  var nonce = result.toString(16);
                  meta.get_cookie().then(private_key => {
                   const privatekey = Buffer.from(private_key,'hex');
                  var contract_function = meta._tokenContract.methods.last_loan_due(a,amt);
                  var contract_function_abi = contract_function.encodeABI();
                  var tx_params = {
                    nonce: '0x' +nonce,
                    gasPrice:  '0x4A817C800',
                    gasLimit: 4000000,
                    from :address,
                    to:meta._tokenContractAddress,
                    //value: amt,
                    data: contract_function_abi
                   }
                   var tx = new Tx(tx_params);
                   tx.sign(privatekey);
                   const serializedtx = tx.serialize(); 
                   meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                     if(err != null)
                      {
                          resolve(0);
                      }
                      else
                      {
                          meta.hash(result).then(res => {
                            if(res == true)
                            {
                              resolve(1);
                            }
                           else if(res == false)
                           {
                              resolve(2);
                           }
                         })
                        }
                      })
                    })
                  })
              })
              }
            }
          })
        })
  })as Promise<number>
}
  
 
  public async withdraw(a): Promise<number> {
    let meta = this;
    return new Promise((resolve, reject) => {
        meta.getAccount().then(address => {
          meta._web3.eth.getTransactionCount(address, function(error,result){
            var nonce = result.toString(16);
              meta.get_cookie().then(private_key => {
                const privatekey = Buffer.from(private_key,'hex');
                // console.log(address);
                // console.log(typeof(a));                
                // // var amt=meta._web3.utils.toWei(a,'ether');
                // console.log("amt"+a);
                
                var contract_function = meta._tokenContract.methods.withdraw(address,a);
              var contract_function_abi = contract_function.encodeABI();
              var tx_params = {
                nonce: '0x' +nonce,
                gasPrice:  '0x4A817C800',
                gasLimit: 4000000,
                from :address,
                to:meta._tokenContractAddress,
                value: '0x00',
                data: contract_function_abi
              }
              var tx = new Tx(tx_params);
              tx.sign(privatekey);
              const serializedtx = tx.serialize(); 
              meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                // console.log(result);
                
                if(err != null)
                 {
                     resolve(0);
                 }
                 else
                 {
                   meta.hash(result).then(res => {
                       if(res == true)
                       {
                         resolve(1);
                       }
                      else if(res == false)
                      {
                         resolve(2);
                      }
                  })
                }
              })
            })
          })
        })
    }) as Promise<number>;
  }
  
  public async deposit(amount): Promise<number> {
    console.log("in");
    
    let meta = this;
      // let val = meta._web3.utils.toWei(amount.toString(),'ether')
      // alert(val)
    return new Promise((resolve, reject) => {
        // let _web3 = this._web3;
        meta.getAccount().then(address => {
          meta._web3.eth.getTransactionCount(address,function(error,result){
            var nonce = result.toString(16);
            meta.get_cookie().then(private_key => {
              var amt_wei=meta._web3.utils.toWei(amount,'ether');
      
                          
              const privatekey = Buffer.from(private_key,'hex');
              var contract_function = meta._tokenContract.methods.deposit(address)
              var contract_function_abi = contract_function.encodeABI();
              var tx_params = {
                nonce:"0x"+nonce, 
                // '0x'+nonce,
                // gasPrice: meta._web3.utils.toHex(3 * 1e9),
                // gasLimit: meta._web3.utils.toHex(3000000),
                gasPrice:'0x4A817C800',
                gasLimit: 4000000,
                from :address,
                to:meta._tokenContractAddress,
                // web3.utils.toHex(web3.utils.toWei(123, 'wei'))
                value:meta._web3.utils.toHex(amt_wei),
                data: contract_function_abi
               }
         
               
                var tx = new Tx(tx_params);
                tx.sign(privatekey);
                const serializedtx = tx.serialize(); 
         
                
                meta._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
                if(err != null)
                  {
                    // console.log("rejected")
                    // console.log(err)
                      resolve(0);
                  }
                  else
                  {
                  // console.log("result"+result);
                    meta.hash(result).then(res => {
                  if(res == true)
                  {
                    resolve(1);
                  }
                  else if(res == false)
                  {
                    resolve(2);
                  }
                  })
             }
           })
         })
       })
      })
    }) as Promise<number>;
  }
  
  public async transfer(a,b): Promise<number> {
    let meta = this;
    return new Promise((resolve,reject) => {
        meta.getAccount().then(address => {
          meta._web3.eth.getTransactionCount(address,function(error,result){
            var nonce = result.toString(16);
            meta.get_cookie().then(private_key => {
              var privatekey = Buffer.from(private_key,'hex');
              var contract_function = meta._tokenContract.methods.transfer(address,a,meta._web3.utils.toWei(b.toString(),'ether'));
              var contract_function_abi = contract_function.encodeABI();
              var tx_params = {
                nonce: '0x' +nonce,
                gasPrice:  '0x4A817C800',
                gasLimit: 4000000,
                from :address,
                to:meta._tokenContractAddress,
                value:'0x00',
                data: contract_function_abi 
              }
              var tx = new Tx(tx_params);
              tx.sign(privatekey);
              const serializedtx = tx.serialize(); 
              meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                if(err != null)
                 {
                     resolve(0);
                 }
                 else
                 {
                   meta.hash(result).then(res => {
                       if(res == true)
                       {
                         resolve(1);
                       }
                      else if(res == false)
                      {
                         resolve(2);
                      }
                  })
                }
              })
            })
          })
        })
    })as Promise<number>;
  }


  public async fduser(fix_id) // Promise<string>
    {
      let meta = this;
      return new Promise((resolve, reject) =>{
          meta.getAccount().then(address => {
            if(parseInt(fix_id) != fix_id)
              {
                alert("Please give the Valid ID");
                resolve(0);
                return;
              }
                meta._tokenContract.methods.fix_dep(fix_id).call(function(err,value){
                  if(value[2] != address)
                      {
                          alert("Invalid ID");
                          resolve(0);
                          return;
                      }
              
                      if(value[6] == false)
                      {
                          alert("Already Settled");
                          resolve(0);
                          return;
                      }
              
                      let time = Math.round((new Date()).getTime() / 1000); 
                      let dep_amt = value[3];
                      let dep_yr = value[5];
                      let amt;
                      // console.log("inside......");
                      
                      if(value[4]> time)
                        {
                          meta._tokenContract.methods.bank(value[1]).call(function(err,val){
                          let bal = parseInt(val[1]);
                          amt = parseInt(dep_amt) - (dep_amt / 100) ;
                          // console.log("Request Amount : "+amt);
                          // console.log("Bank Balance : "+bal);
                          if(bal<amt)
                          {
                            alert("Bank have not enough balance !");
                            resolve(0);
                            return;
                          }
                            meta._web3.eth.getTransactionCount(address,function(error,result){
                              var nonce = result.toString(16);
                                meta.get_cookie().then(private_key => {
                                const privatekey = Buffer.from(private_key,'hex');
                                var contract_function = meta._tokenContract.methods.fix_amt_settlement(fix_id,amt);
                                // console.log("contract fun");
                                
                                var contract_function_abi = contract_function.encodeABI();
                                var tx_params = {
                                    nonce: '0x' +nonce,
                                    gasPrice:  '0x4A817C800',
                                    gasLimit: 4000000,
                                    from :address,
                                    to:meta._tokenContractAddress,
                                    value:'0x00',
                                    data: contract_function_abi 
                                  }  
                                  var tx = new Tx(tx_params);
                                  tx.sign(privatekey);
                                  const serializedtx = tx.serialize(); 
                                  meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                                    if(err != null)
                                      {
                                          resolve(0);
                                      }
                                      else
                                      {
                                        meta.hash(result).then(res => {
                                            if(res == true)
                                            {
                                              resolve(1);
                                            }
                                          else if(res == false)
                                          {
                                              resolve(2);
                                          }
                                      })
                                    }
                                })
                              })
                            })
                          })
                        }
                        else
                        {
                          meta._tokenContract.methods.bank(value[1]).call(function(err,val){
                            let bal = parseInt(val[1]);
                            let int_rete = val[4];
                            amt = parseInt(dep_amt) + ( (dep_amt * dep_yr * (int_rete / 100)) / 100 );
                            // console.log("Request Amount : "+amt);
                            // console.log("Bank Balance : "+bal);
                            if(bal<amt)
                            {
                              alert("Bank have not enough balance !");
                              resolve(0);
                              return;
                            }
                            meta._web3.eth.getTransactionCount(address,function(error,result){
                                var nonce = result.toString(16);
                                meta.get_cookie().then(private_key => {
                                const privatekey = Buffer.from(private_key,'hex');
                                var contract_function = meta._tokenContract.methods.fix_amt_settlement(fix_id,amt);
                                var contract_function_abi = contract_function.encodeABI();
                                var tx_params = {
                                    nonce: '0x' +nonce,
                                    gasPrice:  '0x4A817C800',
                                    gasLimit: 4000000,
                                    from :address,
                                    to:meta._tokenContractAddress,
                                    value:'0x00',
                                    data: contract_function_abi 
                                  }  
                                    var tx = new Tx(tx_params);
                                    tx.sign(privatekey);
                                    const serializedtx = tx.serialize(); 
                                    meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                                      if(err != null)
                                        {
                                            resolve(0);
                                        }
                                        else
                                        {
                                        meta.hash(result).then(res => {
                                          if(res == true)
                                          {
                                            resolve(1);
                                          }
                                          else if(res == false)
                                          {
                                            resolve(2);
                                          }
                                        })
                                      }
                                    })
                                })
                              })
                          }) 
                        }
                    })
                })
            })
         }

  
  
  public async fdowner(fix_idowner)
  {
    let meta = this;
    return new Promise((resolve, reject) =>
    {
      meta.getAccount().then(address => {
        if(parseInt(fix_idowner) != fix_idowner)
        {
            alert("Please give the Valid ID");
            resolve(0);
            return;
        }
        meta._tokenContract.methods.fix_dep(fix_idowner).call(function(err,value){
          if(value[1] != address)
          {
              alert("Invalid ID");
              resolve(0);
              return;
          }

          if(value[6] == false)
          {
              alert("Already Settled");
              resolve(0);
              return;
          }
          let time = Math.round((new Date()).getTime() / 1000); 

          console.log(time,value[4])
          if ((value[4]) > time)
          {
              alert("User deposited time not expired");
              resolve(0);
              return;
          }

          let dep_amt = value[3];
          let dep_yr = value[5];

          meta._tokenContract.methods.bank(address).call(function(err,val){
            let int_rete = val[4];
                let bal = parseInt(val[1]);
                let amt = parseInt(dep_amt) + ( (dep_amt * dep_yr * (int_rete / 100)) / 100 );
                // console.log("Amount : "+amt);
                // console.log("Your Balance : "+bal);
                 
                if(bal<amt)
                {
                  alert("You have not enough balance !");
                  resolve(0);
                  return;
                }
                meta._web3.eth.getTransactionCount(address,function(error,result){
                  var nonce = result.toString(16);
                  meta.get_cookie().then(private_key => {
                  const privatekey = Buffer.from(private_key,'hex');
                  var contract_function = meta._tokenContract.methods.fix_amt_settlement(fix_idowner,amt);
                  var contract_function_abi = contract_function.encodeABI();
                  var tx_params = {
                      nonce: '0x' +nonce,
                      gasPrice:  '0x4A817C800',
                      gasLimit: 4000000,
                      from :address,
                      to:meta._tokenContractAddress,
                      value:'0x00',
                      data: contract_function_abi 
                    }  
                      var tx = new Tx(tx_params);
                      tx.sign(privatekey);
                      const serializedtx = tx.serialize(); 
                      meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                        if(err != null)
                          {
                              resolve(0);
                          }
                          else
                          {
                          meta.hash(result).then(res => {
                            if(res == true)
                            {
                              resolve(1);
                            }
                            else if(res == false)
                            {
                              resolve(2);
                            }
                          })
                        }
                      })
                    })
                 })
              })
            })
          })
       })
}

public async fixeddeposit(bankaddress,depositamount,periodinyrs): Promise<any> {
  let meta = this;
    console.log("inside service");
    
  return new Promise((resolve, reject) => {
      meta.getAccount().then(address => {
        if(bankaddress == address)
        {
            alert("Chance the bank Address");
            resolve(0);
            return;
        }
  
        if(depositamount == 0)
        {
            alert("Enter the Amount...");
            resolve(0);
            return;
        }
  
        if(parseInt(periodinyrs) != periodinyrs || parseInt(periodinyrs) == 0)
        {
            alert("Change the decimal values, You have only deposit the complete number of years");
            resolve(0);
            return;
        }
        // console.log("working.....");
        var dep_amount = meta._web3.utils.toWei(depositamount,'ether');
        //alert(dep_amount);
        let _web3 = this._web3;
        meta._web3.eth.getTransactionCount(address,function(error,result){
          var nonce = result.toString(16);
          meta.get_cookie().then(private_key => {
            const privatekey = Buffer.from(private_key,'hex');
          var contract_function = meta._tokenContract.methods.Fixed_Deposit(bankaddress,periodinyrs);
          // console.log("kaj");
        
          var contract_function_abi = contract_function.encodeABI();
          var tx_params = {
              nonce: '0x' +nonce,
              gasPrice:  '0x4A817C800',
              gasLimit: 4000000,
              from :address,
              to:meta._tokenContractAddress,
              value:meta._web3.utils.toHex(dep_amount),
              data: contract_function_abi 
            }  
              var tx = new Tx(tx_params);
              tx.sign(privatekey);
              const serializedtx = tx.serialize(); 
              meta._web3.eth.sendSignedTransaction('0x' + serializedtx.toString('hex'),function(err,result){
                if(err != null)
                  {
                      resolve(0);
                  }
                  else
                  {
                  meta.hash(result).then(res => {
                    if(res == true)
                    {
                      resolve(1);
                    }
                    else if(res == false)
                    {
                      resolve(2);
                    }
                  })
                }
              })
            })
         })
      })
    }) as Promise<any>;
  }
    
  
 



 
  

 























// public async tok_bal(a):Promise<number>
  // {
  //   let account = await this.getAccount();

  //   return new Promise((resolve, reject) => {
  //     let _web3 = this._web3;
  //     this._tokenContract.ERC20(a).balanceOf(account,function (err, result) {
  //       if(err != null) {
  //         reject(err);
  //       }

  //     resolve(parseInt(result));
  //     });
  //   }) as Promise<number>;
    
  // }


  /*


  dues : function()
  {
    //$("#loan-status").html("Initiating transaction... (please wait)");
  
    var self = this;
    var bank;

    
    var time = Math.round((new Date()).getTime() / 1000); 

    Bank.deployed().then(function(instance) 
    {
        bank = instance;
        return bank.loan_get_count(account);
    }).then(function(valu) 
        {
          var loan_bending = 0;
          var loan_expire = 0;
            for(var i=0;i<valu.toNumber();i++)
            {
                bank.loan_due_pending(i,time,false,{from:account}).then(function(result)
                {
                  bank_list                 
                    if(result[0]==true)
                        loan_bending+=1;
                                           
                    if(result[1]==true)
                        loan_expire+=1;
                    
                    document.getElementById('lp').value = loan_bending;
                    document.getElementById('de').value = loan_expire;
                 
                });
            }
        })
  },


  function loan_due_pending(uint i, uint time,bool id) public view returns(bool,bool)
    {
        uint temp_id;
        bool temp_bending_count;
        bool temp_exp_count;

        if(id == true)
            temp_id = i;
        else
            temp_id = loan_get_id[msg.sender][i];

        if( time >= (loan[temp_id].next_settle_time - 1 minutes  ))
        {
          if( ((loan[temp_id].next_settle_time - 1 minutes  ) <= time) && (time <= loan[temp_id].next_settle_time))
          {
              // if( ((loan[temp_id].months - loan[temp_id].settle_count) * (loan[temp_id].amount / loan[temp_id].months)) > 0 )
              if(loan[temp_id].bal_loan > 0)
                  temp_bending_count = true;
          }
          else
          {
              // if( ((loan[temp_id].months - loan[temp_id].settle_count) * (loan[temp_id].amount / loan[temp_id].months)) > 0 )
              if(loan[temp_id].bal_loan > 0)
                  temp_exp_count = true;
          }
      }
      return (temp_bending_count,temp_exp_count);
  }



  */

}




