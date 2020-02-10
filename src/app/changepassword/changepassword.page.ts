import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AccountService } from '../api/account.service';
import { UserService } from '../api/user.service';
import { loader } from 'src/lab/loader';
import { System } from 'src/lab/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {

  formpack : any = {};
  constructor(public location : Location, public account : AccountService,
    private user : UserService,
    private router : Router)
  {

  }

  ngOnInit() {
  }

  change()
  {
     if (this.formpack.CurrentPassword != '' &&
         this.formpack.NewPassword != '' &&
         this.formpack.ConfirmPassword)
      {
         let send = true;
         let message = null;

         if (this.formpack.NewPassword != this.formpack.ConfirmPassword)
         {
            send = false;
            message = 'New Password doesn\'t match Confirm Password';
         }
         else
         {
            const len = (this.formpack.NewPassword).toString().length;

            if (len < 6)
            {
               send = false;
               message = 'New Password Must be upto 6 characters.';
            }
         }

         if (send)
         {
          loader.show({dismiss:false});

          this.account.prepareToken(()=>{
              this.user.post('customer/changepassword', this.formpack).then((res:any)=>{
                const type = loader.status(res);
                
                loader.dismiss();

                if (type.error)
                {
                  System.error(res.data.message);
                }
                else
                {
                  System.success(res.data.message, ()=>{
                    this.formpack = {};
                    this.router.navigateByData({url:['/dashboard'], data:[]});
                  });  
                  
                }
              });
          });
         }
         else
         {
            if (message !== null)
            {
              System.error(message);
            }
         }
      }
  }

  goback()
  {
      this.location.back();
  }

}
