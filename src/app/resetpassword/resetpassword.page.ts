import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../api/user.service';
import { loader } from '../../lab/loader';
import { System } from '../../lab/message';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage implements OnInit {
  
  email : string;
  securityAnswer : string;
  useappfooter : boolean = false;

  constructor(public router : Router,
    public location : Location,
    private user : UserService) {
      const data = this.router.getNavigatedData();
      if (typeof data == 'object' && typeof data.refer != 'undefined')
      {
         this.useappfooter = true;
         this.email = data.email;
      }
  }

  ngOnInit() {
     
  }

  reset()
  {
     if (System.form())
     {
        loader.show({dismiss : false});

        // check email
        this.user.get('CheckUser?username='+this.email).then((e:any)=>{
          let type = loader.status(e);
          
          if (type.error)
          {
             loader.dismiss();
             System.error('Invalid Username. Please check and try again.');
          }
          else
          {
            this.user.post('user/reset', {username : this.email, securityanswer : this.securityAnswer}).then((res:any)=>{
              loader.dismiss();
              let type = loader.status(res);

              if (type.error)
              {
                System.error(res.data.message);
              }
              else
              {
                System.success(res.data.message, ()=>{
                    this.router.navigateByData({url : ['/home'], data : []});
                });
              }
            });
          }
        });

        
     }
  }

  goto(page : string)
  {
     this.router.navigateByData({url : [page], data : []});
  }

  goback()
  {
    this.location.back();
  }

}
