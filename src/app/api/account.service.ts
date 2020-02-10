import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Storage } from '@ionic/storage';
import { loader } from 'src/lab/loader';
import { Router } from '@angular/router';
import { System } from 'src/lab/message';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  callback : any = null;
  services : any = null;
  token : any;
  data : any = {};
  goto : any = '/dashboard';

  constructor(public user : UserService, public storage : Storage, private router : Router) {
    this.callback = new Function();
    this.services = new Function();
  }

  prepare(data:any)
  {
    const userid = data.id;
    this.token = data.token;

    this.storage.set('accessToken', this.token);

    this.user.get('user?userid='+userid).then((res:any)=>{

        if ('data' in res.data)
        {
          this.data.id = res.data.data.CustomerID;

          this.storage.set('id', res.data.data.CustomerID).then(()=>{

            this.storage.set('customer', res.data.data);

            this.data.customer = res.data.data;

            let where = '/dashboard';
            const data = res.data.data;
            let approved = false;

            if (data.EmailConfirmed == 1 && data.PhoneNumberConfirmed == 1 && data.KYCComplete == 1)
            {
              approved = true;
            }
            else
            {
              approved = false;
              where = '/verification';
            }

            this.storage.set('approved', approved);
              
            this.services.call(Object.create(null), 'prepare', where);

            this.goto = where;

          });
        }
      
    });

    return this;
  }

  loadall(callback:any = null)
  {
     this.accountInfo(()=>{
        if (callback != null)
        {
          callback.call(Object.create(null));
        }
        else
        {
          this.services.call(Object.create(null), 'voucherreport');
        }
     });

     return this;
  }

  accountInfo(callback:any)
  {
    this.prepareToken((id:any)=>{
        this.user.get('accountInfo/'+id).then((res:any)=>{
            this.data = Object.assign({}, {id:this.data.id,
              customer:this.data.customer,
              profileimage:this.data.profileimage},
            res.data);
            callback.call(Object.create(null)); 
        });
    });
  }

  getdata()
  {
     let data = {};
  }

  prepareToken(callback:any)
  {
     this.storage.get('id').then((id:any) => {
        if (this.token == null)
        {
          this.user.token = this.token;
          callback.call(this, id);
        }
        else
        {
          this.storage.get('accessToken').then((token:string)=>{
              this.token = token;
              this.user.token = token;
              callback.call(this, id);
          });
        }
     });
     
  }

  // watch promise
  watch(callback:any, data:any=null)
  {
     this.services = callback;

     return this;
  }

  // load from storage
  get(name:string)
  {
     let data : any = null;
     this.storage.get(name).then((e)=>{
        data = e;
     });

     return data;
  }

  // wallet balance
  balance(callback : any = "")
  {
    this.storage.get('id').then((id)=>{
      
      this.prepareToken(()=>{
        this.user.get('customer/balance/'+id).then((res:any)=>{
          
          this.data.balance = res.data.balance;
          this.data.accountNumber = res.data.accountNumber;

          this.storage.set('balance', res.data.balance).then(()=>{
             if (this.services != null)
             {
              this.services.call(Object.create(null), 'balance');
             }
           });
    
           this.storage.set('accountNumber', res.data.accountNumber).then(()=>{
            if (this.services != null)
            {
              this.services.call(Object.create(null), 'accountNumber');
            }
            if (this.callback != null)
            {
              this.callback.call(Object.create(null));
            }

            if (typeof callback == 'function')
            {
               callback.call(Object.create(null));
            }
          });;
        });
      });

    });
    

    return this;
  }

  // load customer profile
  profile(callback:any="")
  {
    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        this.user.get('customer/view/'+id).then((res:any)=>{
            
          this.data.profile = res.data;
          if (typeof callback == 'function')
            {
              callback.call(Object.create(null));
            }

            this.storage.set('profile', res.data).then(()=>{
              if (this.services != null)
              {
                this.services.call(Object.create(null), 'profile');
              }

              if (this.callback != null)
              {
                this.callback.call(Object.create(null));
              }
            });
        });
      });
    });

    return this;
  }

  // add bank account
  addbank(data:any, callback:any="")
  {

    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        loader.show({dismiss:false});
  
        this.user.put('customer/bank/'+id, data).then((res:any)=>{
          loader.dismiss();
  
          let type = loader.status(res);
          if (type.error)
          {
              if (this.user.alive(res.data.message))
              {
                System.error(res.data.message);
              }
          }
          else
          {
              System.success(res.data.message);

              if (this.services != null)
              {
                this.services.call(Object.create(null), 'addbank');
              }

              if (this.callback != null)
              {
                this.callback.call(Object.create(null));
              }

              if (typeof callback == 'function')
              {
                callback.call(Object.create(null));
              }
          }
  
        });
      });
    });

    return this;
  }

  // get all plans
  allplans(callback:any="")
  {
      this.prepareToken(()=>{
        this.storage.get('id').then((id)=>{

          this.user.get('saving/plans/'+id).then((res:any)=>{
            
            if (res.data.plans != undefined)
            {
              this.data.savingsplans = res.data.plans;
          
              this.storage.set('savingsplans', res.data.plans).then(()=>{
                if (this.services != null)
                {
                  this.services.call(Object.create(null), 'savingsplans');
                }

                if (this.callback != null)
                {
                  this.callback.call(Object.create(null));
                }
              });
            }

            if (typeof callback == 'function')
            {
              callback.call(Object.create(null));
            }

         });
    
        });
      });

     return this;
  }

  // get all report
  allreport(callback:any="")
  {
    this.prepareToken(()=>{
       this.storage.get('id').then((id:any)=>{
          this.user.get('report/all/'+id).then((res:any)=>{
            let type = loader.status(res);
            if (typeof callback == 'function')
            {
                if (!type.error)
                {
                  this.data.allreport = res.data.report;
                }
                else
                {
                  this.data.allreport = [];
                }

                callback.call(Object.create(null));
            }
          });
       });
    });
  }

  // get user bank
  getBank(callback:any="")
  {
    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        this.user.get('bank/'+id).then((res:any)=>{

          if ('data' in res)
          {
            this.data.bank = res.data;
            if (typeof callback == 'function')
            {
               callback.call(Object.create(null), res);
            }
            else
            {
               callback.call(Object.create(null));
            }
          }
            
        });
      });
    });
  }

  // get savings
  getSavings(callback:any="")
  {

    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        this.user.get('customer/plan/'+id).then((res:any)=>{
  
          let type = loader.status(res);
  
          if (type.error)
          {
              this.user.alive(res.data.message);
              this.data.plans = {};
              
              this.storage.set('plans', {}).then(()=>{
                if (this.services != null)
                {
                  this.services.call(Object.create(null), 'plans');
                }
              });
          }
          else
          {
             if (typeof res.data.plan != undefined)
             {
                this.data.plans = res.data.plan;

                this.storage.set('plans', res.data.plan).then(()=>{
                  if (this.services != null)
                  {
                    this.services.call(Object.create(null), 'plans');
                  }
                  if (this.callback != null)
                  {
                    this.callback.call(Object.create(null));
                  }
                }); 
             }
          }

          if (typeof callback == 'function')
          {
            callback.call(Object.create(null), res);
          }

        });
      });
    });

    return this;
  }

  // add savings plan
  addSavings(data:any, callback:any="")
  {
    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        loader.show({dismiss:false});
  
        this.user.put('saving/add/'+id, data).then((res:any)=>{
          loader.dismiss();
  
          let type = loader.status(res);
          if (type.error)
          {
              if (this.user.alive(res.data.message))
              {
                System.error(res.data.message);
              }
          }
          else
          {
              System.success(res.data.message);
              
              if (this.services != null)
              {
                this.services.call(Object.create(null), 'addsavings');
              }

              if (this.callback != null)
              {
                this.callback.call(Object.create(null));
              }

              if (typeof callback == 'function')
              {
                callback.call(Object.create(null));
              }
          }
        });
      });
    });

    return this;
  }

  // fund savings
  fundSavings(data:any, callback:any="")
  {
    loader.show({dismiss:false});

    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        this.user.put('saving/fund/'+id, data).then((res:any)=>{
          loader.dismiss();
  
          let type = loader.status(res);
          if (type.error)
          {
              if (this.user.alive(res.data.message))
              {
                System.error(res.data.message);
              }
          }
          else
          {
              System.success(res.data.message);
              this.services.call(Object.create(null), 'fundsavings');
              this.callback.call(Object.create(null));

              if (typeof callback == 'function')
              {
                callback.call(Object.create(null));
              }
          }
  
        });
      });
    });
    
    return this;
  }

  // change user pin
  changePin(data:any, callback:any)
  {

    loader.show({dismiss:false});

    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        this.user.post('customer/changepin/'+id, data).then((res:any)=>{
          let type = loader.status(res);
          if (type.error)
          {
              if (this.user.alive(res.data.message))
              {
                System.error(res.data.message);
              }
          }
          else
          {
              System.success(res.data.message);
              this.services.call(Object.create(null), 'changepin');
              this.callback.call(Object.create(null));
              if (typeof callback == 'function')
              {
                callback.call(Object.create(null));
              }
          }
        });
      });
    });

    return this;
  }

  // verify user
  verify(type:string, data:any, callback:any="")
  {

      loader.show({dismiss:false});

      this.prepareToken(()=>{
        this.storage.get('id').then((id)=>{
          let path = 'verify/kyc/'+id;
  
          if (type == 'Bank')
          {
            path = 'verify/bank/'+id;
          }
          else if (type == 'Phone')
          {
            path = 'verify/phone/'+id;
          }
  
          this.user.post(path, data).then((res:any)=>{
            loader.dismiss();
  
            let type = loader.status(res);
            if (type.error)
            {
                if (this.user.alive(res.data.message))
                {
                  System.error(res.data.message);
                }
            }
            else
            {
                System.success(res.data.message);
                this.services.call(Object.create(null), 'verify');
                this.callback.call(Object.create(null));
                if (typeof callback == 'function')
                {
                  callback.call(Object.create(null));
                }
            }
          });
        });
      });

      return this;
  }

  // withdraw
  withdraw(type:string, data:any, callback:any="")
  {

    loader.show({dismiss:false});

    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        let path = 'withdraw/'+type+'/'+id;
  
  
        this.user.post(path, data).then((res:any)=>{
          loader.dismiss();
  
            let type = loader.status(res);
            if (type.error)
            {
                if (this.user.alive(res.data.message))
                {
                  System.error(res.data.message);
                }
            }
            else
            {
                System.success(res.data.message);
  
                if ('data' in res.data)
                {
                  this.services.call(Object.create(null), 'withdraw', res.data);
                  this.callback.call(Object.create(null), res.data);
                }
                else
                {
                  this.services.call(Object.create(null), 'withdraw');
                  this.callback.call(Object.create(null));
                }

                if (typeof callback == 'function')
                {
                  callback.call(Object.create(null));
                }
            }
        });
      });
    });

    return this;
  }

  // get report
  report(type:string,length:number=20, load:boolean = false, extra:string="", callback:any="")
  {

    if (load === true)
    {
      loader.show({dismiss:false});
    }

    const tt = type;

    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        let typelink = 'report/'+type+'/';
  
        let path = typelink+id+'?limit='+length+extra;
  
        this.user.get(path).then((res:any)=>{
          if (load === true)
          {
              loader.dismiss();
          }
  
          let type = loader.status(res);
            if (type.error)
            {
                if (this.user.alive(res.data.message))
                {
                   // System.error(res.data.message);
                }
            }
            else
            {
               this.data[tt+'report'] = res.data.report;
                
              
            }

            if (typeof callback == 'function')
            {
              callback.call(Object.create(null), res);
            }
        });
      });
    });

    return this;
  }

  withdrawals(callback:any = {})
  {
    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
          this.user.get('customer/withdrawal/'+id).then((res:any)=>{
              this.data.withdrawal = res.data;
              if (typeof callback == 'function')
              {
                 callback.call(Object.create(null), res);
              }
          });
      });
    });
  }

  // agent functions
  agent(type:string, data:any={}, callback:any="")
  {
  
    loader.show({dismiss:false});

    this.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        let path = 'agent/'+type+'/'+id;
  
        this.user.post(path, data).then((res:any)=>{
          loader.dismiss();
  
            let type = loader.status(res);
            if (type.error)
            {
                if (this.user.alive(res.data.message))
                {
                  System.error(res.data.message);
                }
            }
            else
            {
              if ('message' in res.data)
              {
                  System.success(res.data.message);
                  this.services.call(Object.create(null), 'agent');
                  this.callback.call(Object.create(null), 'agent');
              }
              else
              {
                  this.services.call(Object.create(null), 'agent', res.data);
                  this.callback.call(Object.create(null), res.data);
              }

              if (typeof callback == 'function')
              {
                callback.call(Object.create(null));
              }
            }
        });
      });
    });

    return this;
  }

  // banks
  banks(callback:any="")
  { 
     this.prepareToken(()=>{
      this.user.get('banks').then((res:any)=>{
        this.data.banks = res.data;
        if (typeof callback == 'function')
        {
          callback.call(Object.create(null));
        }

        this.storage.set('banks', res.data).then(()=>{
         this.services.call(Object.create(null), 'banks', res.data);
         this.callback.call(Object.create(null), res.data);
        });
      });
     });
     return this;
  }

  // promise
  then(callback:any)
  {
    this.callback = new callback;
  }

  // lastlogin
  lastlogin(data:any)
  {
     this.prepareToken(()=>{
        this.user.post('device/login', data);
     });
  }
}
