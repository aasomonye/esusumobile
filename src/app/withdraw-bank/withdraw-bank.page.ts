import { Component, OnInit } from '@angular/core';
import { AccountService } from '../api/account.service';
import { UserService } from '../api/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';

@Component({
  selector: 'app-withdraw-bank',
  templateUrl: './withdraw-bank.page.html',
  styleUrls: ['./withdraw-bank.page.scss'],
})
export class WithdrawBankPage implements OnInit {

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
      let endpoint = 'withdraw/bank/';

      const id = this.account.data.id;
      endpoint += id;

      if (Number(this.formpack.DepositAmount) > 0)
      {
        let balance = this.balance.toString().replace(/[,]/,'');

        if (
          parseFloat(this.formpack.DepositAmount) <= parseFloat(balance))
        {
            this.account.prepareToken(()=>{
              loader.show({dismiss:false});
              loader.text('processing');

                this.user.post(endpoint, {
                  DepositAmount : Number(this.formpack.DepositAmount),
                  PIN : Number(this.formpack.PIN)
                }).then((res:any)=>{
                    const type = loader.status(res);

                    if (type.error)
                    {
                      loader.dismiss();

                      System.error(res.data.message);
                    }
                    else
                    {

                        loader.text('Updating wallet.');

                        this.account.loadall(()=>{
                          loader.dismiss(1000);
                          System.success(res.data.message, ()=>{
                              this.router.navigateByData({url:['/dashboard'], data:[]});
                          });
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
    }
  }

}
