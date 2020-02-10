import { Component, OnInit } from '@angular/core';
import { AccountService } from '../api/account.service';
import { UserService } from '../api/user.service';
import { loader } from 'src/lab/loader';
import { Storage } from '@ionic/storage';
import { System } from 'src/lab/message';
import { Location } from '@angular/common';

@Component({
  selector: 'app-agent-transfer',
  templateUrl: './agent-transfer.page.html',
  styleUrls: ['./agent-transfer.page.scss'],
})
export class AgentTransferPage implements OnInit {

  loaded : boolean = false;
  formpack : any = {};
  banks : any = [];
  BankName : string = '';
  RecepientAccountNumber : string = '';
  DepositAmount : string = '';
  PIN : string = '';

  constructor(public account : AccountService,
    private user : UserService,
    private storage : Storage,
    private location : Location) {
    this.formpack = Object.create(null);

    // check if banks exits
    if ('banks' in this.account.data)
    {
       this.banks = this.account.data.banks;
       this.loaded = true;
    }
    else
    {
      // check storage
      this.storage.get('banks').then((banks:any)=>{
          if (banks !== null)
          {
             this.banks = banks;
             this.loaded = true;
          }
          else
          {
             this.getBanks();
          }
      });
    }
  } 

  goback()
  {
     this.location.back();
  }

  getBanks()
  {
    loader.show();
    this.account.prepareToken(()=>{
      this.user.get('banks').then((res:any) => {
          this.banks = res.data.data;
          this.loaded = true;
          this.account.data.banks = this.banks;
          // save
          this.storage.set('banks', this.banks);
          loader.dismiss();
      });
    });
  }

  ngOnInit() {
  }

  process()
  {
     switch (
        this.BankName != '' && this.RecepientAccountNumber != ''
        && parseFloat(this.DepositAmount) >= 100 && this.PIN != ''
     )
     {
        case true:
            // process transfer
            loader.show({dismiss:false});
            this.account.prepareToken((id:any)=>{
                loader.text("processing..");
                this.user.post('transfer/'+id, {
                  BankName : this.BankName,
                  RecepientAccountNumber : this.RecepientAccountNumber,
                  DepositAmount : this.DepositAmount,
                  PIN : this.PIN
                }).then((res:any)=>{
                  let type = loader.status(res);
  
                  if (type.error)
                  {
                    loader.dismiss();
                    System.error(res.data.message);
                  }
                  else
                  {
                    this.PIN = '';
                    this.RecepientAccountNumber = '';
                    this.DepositAmount = '';

                    this.account.accountInfo(()=>{ 
                        loader.dismiss();
                        System.success(res.data.message);
                    });
                  }
                });
            });
        break;

        case false:
            if (parseFloat(this.DepositAmount) < 100)
            {
               System.error('Transfer Minimum is ₦100');
            }
            else
            {
              System.error('All fields are required!');
            }
        break;
     }
  }

}
