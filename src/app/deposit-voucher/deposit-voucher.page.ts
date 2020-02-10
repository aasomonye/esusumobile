import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { System } from 'src/lab/message';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';
import { loader } from 'src/lab/loader';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-deposit-voucher',
  templateUrl: './deposit-voucher.page.html',
  styleUrls: ['./deposit-voucher.page.scss'],
})
export class DepositVoucherPage implements OnInit {

  formpack : any = {};

  constructor(public location : Location,
    private user : UserService,
    public account : AccountService,
    public router : Router) {
      this.formpack = Object.create(null);  
    }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  fund()
  {
     if (System.form())
     {
        AppComponent.pauseTimer = true;

        loader.show({dismiss:false});

        this.account.prepareToken(()=>{
           const id = this.account.data.id;

         //   var serial = this.formpack.SerialNumber.toString().length;
         //   var zeros = '0000000000';
         //   zeros = zeros.substr(0, (zeros.length-serial)) + this.formpack.SerialNumber;

         //   this.formpack.SerialNumber = zeros;

           this.user.post('deposit/liquidate/'+id, this.formpack).then((res:any)=>{
              const type = loader.status(res);

              if (type.error)
              {
                 loader.dismiss();
                 AppComponent.pauseTimer = false;
                 System.error(res.data.message);
              }
              else
              {
                  loader.text('updating wallet');

                  this.account.accountInfo(()=>{
                      loader.dismiss(1000);
                      this.formpack = Object.create(null);  
                      AppComponent.pauseTimer = false;
                      System.success(res.data.message, ()=>{
                         this.router.navigateByData({url:['/dashboard'], data:[]});
                      });
                  });
              }
           });
        });
     }
  }

}
