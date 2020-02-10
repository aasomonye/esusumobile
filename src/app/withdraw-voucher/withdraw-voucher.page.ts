import { Component, OnInit } from '@angular/core';
import { AccountService } from '../api/account.service';
import { UserService } from '../api/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';

@Component({
  selector: 'app-withdraw-voucher',
  templateUrl: './withdraw-voucher.page.html',
  styleUrls: ['./withdraw-voucher.page.scss'],
})
export class WithdrawVoucherPage implements OnInit {

  formpack : any = {};
  balance : any = null;

  constructor(public account : AccountService,
    public user : UserService,
    public router : Router,
    public location : Location) { 
    this.formpack = Object.create(null);
    this.balance = this.account.data.balance;
  }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  process()
  {
    if (System.form('.intro-form'))
    {
      let endpoint = 'withdraw/voucher/';

      const id = this.account.data.id;
      endpoint += id;

      if (Number(this.formpack.amount) >= 100)
      {
        var bal = this.balance.toString().replace(/[,]/,'');

        if (
          parseFloat(this.formpack.amount) <= parseFloat(bal))
        {
            this.account.prepareToken(()=>{
              loader.show({dismiss:false});
              loader.text('processing');

                this.user.post(endpoint, {
                  Amount : Number(this.formpack.amount),
                  PIN : Number(this.formpack.pin)
                }).then((res:any)=>{
                    const type = loader.status(res);

                    if (type.error)
                    {
                      loader.dismiss();

                      System.error(res.data.message, ()=>{
                        this.router.navigateByData({url:['/withdraw'], data : []});
                      });
                    }
                    else
                    {

                        loader.text('Updating wallet.');

                        this.account.accountInfo(()=>{
                          this.balance = this.account.data.balance;
                          this.formpack.amount = "";
                          this.formpack.pin = "";
                          loader.dismiss();
                          this.router.navigateByData({url:['/vouchers'], data : {vouchers : res.data.voucher}});
                        });
                    }
                });
            });
        }
        else
        {
            System.error('Insufficent wallet balance. Cannot process request.');
        }
      }
      else
      {
        System.error('Minimum amount for withdrawal is ₦100');
      }
    }
  }

}
