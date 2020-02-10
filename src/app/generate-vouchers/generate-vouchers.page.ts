import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';
import { Router } from '@angular/router';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';

@Component({
  selector: 'app-generate-vouchers',
  templateUrl: './generate-vouchers.page.html',
  styleUrls: ['./generate-vouchers.page.scss'],
})
export class GenerateVouchersPage implements OnInit {

  formpack : any = {};

  constructor(private location : Location,
    private user : UserService,
    public account : AccountService,
    private router : Router) {
      this.formpack = Object.create(null);
    }

  ngOnInit() {
  }

  goback()
  {
     this.location.back();
  }

  generate()
  {
     if (System.form())
     {
        if (Number(this.formpack.NumberOfVouchers) > 0 && Number(this.formpack.NumberOfVouchers) <= 1000000)
        {
            if (Number(this.formpack.Amount) >= 100)
            {
             loader.show({dismiss:false});
             const id = this.account.data.id;
             const s = Number(this.formpack.NumberOfVouchers) > 1 ? 's' : '';

             this.account.prepareToken(()=>{
                loader.text("Sending Request");

                this.user.post('withdraw/voucher/'+id, this.formpack).then((res:any)=>{
                    loader.text('Getting Response');

                    const type = loader.status(res);
                    if (type.error)
                    {
                       loader.dismiss();

                       if (this.user.alive(res.data.message))
                       {
                          System.error(res.data.message);
                       }
                    }
                    else
                    {
                       loader.text('Generating Voucher'+s);
                       const data = res.data.voucher;
                       
                       this.account.accountInfo(()=>{
                           loader.dismiss(1000);
                           this.router.navigateByData({url : ['/vouchers'], data : {vouchers : data}});
                        });
                    }
                });
             });
            }
            else
            {
               System.error('Voucher Amount must be equal or above N100');
            }
        }
        else
        {
           System.error('Invalid Voucher limit. Must be within the range of 1 - 1000000');
        }
     }
  }
}
