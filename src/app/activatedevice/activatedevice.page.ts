import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../api/user.service';
import { loader } from '../../lab/loader';
import { System } from '../../lab/message';
import { AccountService } from '../api/account.service';
import { Storage } from '@ionic/storage';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-activatedevice',
  templateUrl: './activatedevice.page.html',
  styleUrls: ['./activatedevice.page.scss'],
})
export class ActivatedevicePage implements OnInit {
  
  page : string = 'Back';
  header : string = "Changed your\nDevice?";
  caption : string = "Having problem logging into your dashboard?";
  email : string;
  data : any;
  password : string;
  
  constructor(public location : Location, public router : Router,
    public user : UserService,
    private account : AccountService,
    private storage : Storage) {
    
    UserService.runningService = false;
    const data = this.router.getNavigatedData();
    
    if ('activate' in data)
    {
        this.header = data.activate.header;
        this.caption = "";
        this.email = data.activate.email;
        this.data = data.activate;
    }
     
  }

  ngOnInit() {
    UserService.runningService = false;
  }

  ionViewWillEnter()
  {
      AppComponent.isloggedin = false;
      UserService.runningService = false;
  }

  goback()
  {
    this.location.back();
  }

  activate()
  {
    if (System.form())
    {
        loader.show({dismiss : false});

        // login this user
        this.user.post('user/auth',{username : this.email, password : this.password}).then((e:any)=>{
          const type = loader.status(e);
          
          if (type.error)
          {
            loader.dismiss();
            System.error(e.data.message);     
          }
          else
          {

            this.user.post('device/activate', {username:this.email}).then((res:any)=>{
          
              const type = loader.status(res);
              
              if (type.error)
              {
                 loader.dismiss();
                 System.error(res.data.message);   
              }
              else
              { 
                this.account.data.profileimage = this.user.endpoint + this.user.imagedir + e.data.profileimage;
                // save username
                this.storage.set('username', this.email);

                loader.dismiss();

                const response = {
                  response : res.data.build,
                  goto : this.account.goto,
                  auth : e
                };
                
                this.router.navigateByData({url : ['/activatenow'], data : response});

              }
           });
          }
       });
       
    }
  }
}
