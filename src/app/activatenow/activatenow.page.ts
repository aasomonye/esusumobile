import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../api/user.service';
import { loader } from 'src/lab/loader';
import { System } from 'src/lab/message';
import { Storage } from '@ionic/storage';
import { AccountService } from '../api/account.service';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-activatenow',
  templateUrl: './activatenow.page.html',
  styleUrls: ['./activatenow.page.scss'],
})
export class ActivatenowPage implements OnInit {
  email : string = "";
  phone : string = "";
  response : any = {};
  activate : any = false;
  requestTime : any = false;
  code : any = [];
  goto : string;
  auth : any = {};

  constructor(public location : Location, public elem : ElementRef,
    public router : Router,
    private storage : Storage,
    private user : UserService,
    private account : AccountService) {

    const data = this.router.getNavigatedData();
    
    if ('response' in data)
    {
       this.response = data.response;
       this.email = data.response.email;
       this.phone = data.response.phone;
       this.goto = data.goto;
       this.auth = data.auth;

       setTimeout(()=>{
          this.requestTime = true;
       },50000);
    }
  }

  onChange(event:any)
  {
     const targ : any = event.target;
     if (targ.nextElementSibling != null)
     {
         targ.nextElementSibling.focus();
     }
     else
     {
         this.trySubmit();
     }
  }

  ngOnInit() {
     
  }
  
  ionViewWillEnter()
  {
   if (AppComponent.shouldgoBack === false)
   {
      // redirect to dashboard
      this.router.navigateByData({url:['/dashboard'], data:[]});
   }
  }

  trySubmit()
  {
      var inputs = document.querySelectorAll('.code-inputs > input');

      var code = '';
      [].forEach.call(inputs, (e:any)=>{
         code += e.value;
      });

      if (this.response.code == code)
      {
          this.signin();
      }
  }

  listen()
  {
    setTimeout(()=>{
      this.requestTime = true;
    },50000);
  }

  resend()
  {
      if (this.requestTime === true)
      {
         loader.show({dismiss : false});
         this.user.post('device/activate', {username:this.email}).then((res:any)=>{
          
            loader.dismiss();
            System.success('Code resent. You should get it now or within the next 5 minutes');
            this.requestTime = false;
            this.listen();
            this.response = res.data.build;
         });
      }
      else
      {
         System.error('Request still in progress. You should initiate a new request after 5 minutes.');
      }
  }

  signin()
  {
    if (System.form('.code-inputs'))
    {
       var inputs = document.querySelectorAll('.code-inputs > input');

       var code = '';
       [].forEach.call(inputs, (e:any)=>{
          code += e.value;
       });

       if (this.response.code == code)
       {
         loader.show({dismiss : false});

          // success 
          this.user.post('device/activate',{
              deviceHash : this.response.data.deviceHash,
              userid : this.response.data.userid,
              code : this.response.code,
              method : this.response.method,
              time : this.response.time
          }).then((e:any)=>{
            this.storage.set('deviceHash', this.response.data.deviceHash).then(()=>{
               loader.text('encrypting account');
               
               // set device hash
               AppComponent.devicehash = this.response.data.deviceHash;

               this.account.lastlogin({username : this.email});

               this.account.prepare(this.auth.data).watch((e:string, goto:string)=>{
                  if (e == 'prepare')
                  {
                     loader.text('almost done');

                    this.account.loadall().watch((ex:any)=>{
                        
                        if (ex == 'voucherreport')
                        {
                           loader.text('ready');
                           loader.dismiss(500);

                           AppComponent.isloggedin = true;
                           UserService.runningService = true;

                           if (goto == '/verification')
                           {
                               AppComponent.shouldgoBack = false;
                           }

                           this.router.navigateByData({url : [goto], data : ['home']});
                        }
                    });
                    
                  }
                
               });
               
               // this.account.prepare(this.auth.data).watch()
               // this.account.loadall().watch((e:string)=>{

               //    if (e == 'voucherreport')
               //    {
               //       loader.text('ready');
               //       loader.dismiss(1000);

               //       this.router.navigateByData({url:[this.goto], data : ['home']});
               //    }
               // });

            });
          });
       }
       else
       {
          System.clear('.code-inputs');
          System.form('.code-inputs');
       }
    }
  }

  goback()
  {
    this.location.back();
  }
}
