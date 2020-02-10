import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AccountService } from '../api/account.service';
import { UserService } from '../api/user.service';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bankform',
  templateUrl: './bankform.page.html',
  styleUrls: ['./bankform.page.scss'],
})
export class BankformPage implements OnInit {

  banks : any = null;
  loaded : boolean = false;
  accountname : string;
  accountnumber : string;
  pin : string;
  bank : any = null;
  id : any;

  constructor(public storage : Storage,
    public account : AccountService,
    private user : UserService,
    private router : Router) {
    
    this.storage.get('id').then((id:any)=>{
      this.id = id;
    });

    if (this.banks === null)
    {
      this.getBanks();
    }

    this.storage.get('banks').then((e:any)=>{
        this.banks = e.data;
        this.loaded = true;
    });
  }

  getBanks()
  {
    loader.show();
    this.account.prepareToken(()=>{
      this.user.get('banks').then((res:any) => {
          this.banks = res.data.data;
          this.loaded = true;
          this.account.data.banks = this.banks;
          loader.dismiss();
      });
    });
  }

  ngOnInit() {
  }

  continue()
  {
    if (System.form())
    {
       if (this.bank != null)
       {
         loader.show({dismiss : false});
          this.account.prepareToken(()=>{
             this.user.post('verify/bank/'+this.id, {
              AccountHolderName : this.accountname,
              AccountNumber : this.accountnumber,
              PIN : this.pin,
              BankID : this.bank
             }).then((res:any)=>{
                let type = loader.status(res);
                loader.dismiss();

                if (type.error)
                {
                  if (this.user.alive(res.data.message))
                  {
                      System.error(res.data.message);
                  }
                }
                else
                {
                  System.success(res.data.message, ()=>{
                      this.router.navigateByData({url : ['/verification'], data : ['home']});
                  });
                }
             });
          });
       }
       else
       {
          System.error('You haven\'t selected a bank');
       }
       
    }
  }

}
