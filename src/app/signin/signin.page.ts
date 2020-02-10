import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { UserService } from '../api/user.service';
import { loader } from '../../lab/loader';
import { System } from '../../lab/message';
import { AccountService } from '../api/account.service';
import { Storage } from '@ionic/storage';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  
  header : string;
  remark : string;
  email : string;
  password : string;

  constructor(public router : Router, private user : UserService,
   public account : AccountService,
   public storage : Storage) {
      let response = this.router.getNavigatedData();
      if (typeof response == 'object')
      {
         this.header = response.data.header;
         this.remark = response.data.message;
         this.email = response.email;
      }

      AppComponent.isloggedin = false;
      UserService.runningService = false;
  }

  ngOnInit() {
   
  }

  ionViewWillEnter()
  {
      AppComponent.isloggedin = false;
      UserService.runningService = false;
  }

  continue()
  {
     if (this.password.length > 1)
     {
         AppComponent.isloggedin = false;
         UserService.runningService = false;

         loader.show({dismiss : false});

         const data = {username : this.email, password : this.password};
         
         this.user.post('user/auth', data).then((res:any)=>{
            
            let type = loader.status(res);

            if (type.error)
            {
               loader.dismiss();
               System.error(res.data.message, ()=>{
                  System.__error('#password');
               });
            }
            else
            {
               loader.text('encrypting account');

               this.account.lastlogin(data);
               this.account.data.profileimage = this.user.endpoint + this.user.imagedir + res.data.profileimage;

               // save username
               this.storage.set('username', this.email);

               this.account.prepare(res.data).watch((e:string, goto:string)=>{
                  if (e == 'prepare')
                  {
                     loader.text('almost done');

                    this.account.loadall().watch((ex:any)=>{
                        
                        if (ex == 'voucherreport')
                        {
                           loader.text('ready');
                           loader.dismiss(500);

                           // set is loggedin
                           AppComponent.isloggedin = true;

                           if (goto == '/verification')
                           {
                               AppComponent.shouldgoBack = false;
                           }

                           UserService.runningService = true;

                           this.router.navigateByData({url : [goto], data : ['home']});
                        }
                    });
                    
                  }
                
               });
            }
         });
     }
     else
     {
        System.__error('#password');
     }
  }

  goto(page : string)
  {
     this.router.navigateByData({url : [page], data : []});
  }

}
