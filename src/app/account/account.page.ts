import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../api/user.service';
import { loader } from '../../lab/loader';
import { System } from '../../lab/message';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home.page';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
   username : string = "";
   error : any = {};
   deviceHash : any = false;
   title : string = 'Login to your account';
   users : number = 100000;
   count : any = 0;

   constructor(
      public router : Router,
      public user : UserService,
      private storage : Storage,
      private ref : ElementRef)
   {

      AppComponent.isloggedin = false;
      UserService.runningService = false;

       // remember username;
      this.storage.get('username').then((un:any)=>{
        this.username = un;
      }); 

      // add track
      this.addtrack();

      // get users
      this.storage.get('users').then((res:any)=>{
         if (res != null && res !== undefined)
         {
            this.users = res;

            // update again
            this.user.get('users').then((res:any)=>{
               this.users = res.data.users;
               // save 
               this.storage.set('users', this.users);
            });
         }
         else
         {
            this.users = HomePage.users;
         }
      });
   }

   addtrack()
   {
      this.count = HomePage.users;
         
      const num = setInterval(()=>{
         if (this.users > 100000)
         {
            clearInterval(num);
            this.count = this.users.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
         }
      },10);
   }
  
  ngOnInit()
  {
      AppComponent.isloggedin = false;
      UserService.runningService = false;
  }

   ngAfterViewInit()
  {
     AppComponent.isloggedin = false;
     UserService.runningService = false;
  }

  loadConfig()
  {
      const data = this.router.getNavigatedData();

      if (typeof data == 'object' && 'email' in data)
      {
         this.username = data.email;
      }

      // remember username;
      this.storage.get('username').then((un:any)=>{
        this.username = un;
      }); 
  }

  ionViewDidLoad()
  {
      this.loadConfig();
  }

   __error(clas:any, error = '')
   {
      let ele : any = document.querySelector('.'+clas+' > input');
      ele.classList.add('shakeform');
      
      setTimeout(()=>{
        ele.classList.remove('shakeform');
        ele.focus();
      },600);
   }

  //  sign in page
   signin()
   {
      if (this.username.length > 1)
      {
         loader.show({dismiss : false});
         loader.text('performing handshake');

         this.storage.get('deviceHash').then((e)=>{

            let deviceHash = false;

            if (e != null)
            {
               deviceHash = e;
            }

            if (AppComponent.devicehash != null)
            {
               deviceHash = AppComponent.devicehash;
            }

            let email = this.username;

            this.user.get('CheckUser?username='+email).then((e:any)=>{
               
                let type = loader.status(e);
                
                if (type.error)
                {
                   loader.dismiss(); 
    
                   System.error('Login failed, '+ e.data.message,()=>{
                      this.__error('email');
                   }, 'Close');
                }
                else
                {
                   const activate = {
                                     activate : {
                                        header : 'Device not Activated',
                                        email : email,
                                        goto : '/signin',
                                        data : e.data}
                                     };
    
                   if (deviceHash === false)
                   {
                       loader.dismiss(); 
                       this.router.navigateByData({url : ['/activatedevice'], data : activate});
                   }
                   else
                   {
                      loader.text('checking your device');
                      // check
                      this.user.post('device/check', {username : email, deviceHash : deviceHash})
                      .then((res:any)=>{
                          loader.dismiss(); 
                          var response = res.data.status, canContinue = false;

                          if (response != undefined && response === 'Success')
                          {
                              canContinue = true;
                          }

                          if (canContinue)
                          {
                              if (AppComponent.devicehash == null)
                              {
                                 AppComponent.devicehash = deviceHash;
                              }

                             // login page
                             const data = {email : email, data : e.data};
                             this.router.navigateByData({url : ['/signin'], data : data});
                          }
                          else
                          {
                             // activation page
                             this.router.navigateByData({url : ['/activatedevice'], data : activate});
                          }
                      });
                   }
                   
                }
            });
         });
      }
      else
      {
         this.__error('email');
      }
      
   }
}
