import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { UserService } from '../api/user.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
   public static users : any = '100k';

   constructor(
      public router : Router,
      private storage : Storage,
      private splash : SplashScreen,
      private user : UserService)
   {
      // get users 
      this.user.get('users').then((res:any)=>{
         HomePage.users = res.data.users;
         // save 
         this.storage.set('users', HomePage.users);
      });

      this.storage.get('skip-intro').then((skip:any)=>{
         if (skip===true)
         {
            this.router.navigateByData({url:['/account'], data:[]}).then(()=>{
               setTimeout(()=>{
                  this.splash.hide();
               },1500);
            });
         }
         else
         {
            setTimeout(()=>{
               this.splash.hide();
            },1000);
         }
      });  
   }

  start()
  {
      this.storage.set('skip-intro', true).then(()=>{
         this.router.navigateByData({url:['/account'], data:[]});
      });   
  }

}
