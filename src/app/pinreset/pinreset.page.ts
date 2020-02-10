import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pinreset',
  templateUrl: './pinreset.page.html',
  styleUrls: ['./pinreset.page.scss'],
})
export class PinresetPage implements OnInit {

  newpin : string;
  newpinagain : string;
  oldpin : string;

  constructor(public location : Location,
      private user : UserService,
      public account : AccountService,
      private router : Router) { }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  change()
  {
     if (System.form())
     {
        if (this.newpin == this.newpinagain)
        {
            loader.show({dismiss : false});

            this.account.prepareToken(()=>{
                loader.text('processing');

                this.user.post('customer/changepin/'+this.account.data.id, {
                  CurrentPin : this.oldpin,
                  NewPin : this.newpin,
                  ConfirmPin : this.newpinagain
                }).then((res:any)=>{
                    loader.dismiss();
                    const type = loader.status(res);
                    if (type.error)
                    {
                      System.error(res.data.message);
                    }
                    else
                    {
                        System.success(res.data.message, ()=>{
                           this.router.navigateByData({url : ['/dashboard'], data : []});
                        });
                    }
                }); 
            });
        }
        else
        {
          System.error('Pin doesn\'t match. Please try again', ()=>{
              this.newpin = "";
              this.newpinagain = "";
          });
        }
     }
  }
}
