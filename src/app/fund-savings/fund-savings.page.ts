import { Component, OnInit } from '@angular/core';
import { AccountService } from '../api/account.service';
import { loader } from 'src/lab/loader';
import { System } from 'src/lab/message';
import { UserService } from '../api/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fund-savings',
  templateUrl: './fund-savings.page.html',
  styleUrls: ['./fund-savings.page.scss'],
})
export class FundSavingsPage implements OnInit {

  plans : any = [];
  formpack : any = {};
  savingsPlanID : any = null;

  constructor(public account : AccountService,
    public user : UserService,
    public router : Router,
    public location : Location) {
      const data = this.router.getNavigatedData();
      if (typeof data == 'string')
      {
         this.savingsPlanID = data;
      }
      this.formpack = Object.create(null);
      this.loadplans();
  }

  ngOnInit() {
  }

  loadplans()
  {
    const data = this.account.data;
    
    if ('plans' in data && typeof data.plans != 'undefined')
    {
       let plans = [];

       for (var i in data.plans)
       {
          for (var x in data.plans[i])
          {
            if (data.plans[i][x].Status == 'Active')
            {
              data.plans[i][x].Name = x;
              data.plans[i][x].name = x;
              plans.push(data.plans[i][x]);
            }
          }
       }

       this.plans = plans;
    }
  }

  goback()
  {
     this.savingsPlanID = null;
     this.location.back();
  }

  getCode(code:any)
  {
     let codeToString = code.toString().substr(-4,4);
     return codeToString;
  }

  fund()
  {
      var passed = false;
      var message = 'All input fields are required',
          amountError = 'Amount must be equal or above ₦50';

      if (this.savingsPlanID != null)
      {
         this.formpack.savingsPlanID = this.savingsPlanID;

         if (Number(this.formpack.Amount) >= 50)
         {
            passed = true;
         }
         else
         {
            message = amountError;
         }
      }
      else
      {
         if (Number(this.formpack.Amount) >= 50)
         {
            this.formpack.Description = this.formpack.Description == '' ? 'Savings funding' : this.formpack.Description;
            if (Number(this.formpack.savingsPlanID) > 0)
            {
              passed = true;
            }
            else
            {
              message = 'Please select a saving plan to fund.';
            }
         }
         else
         {
            message = amountError;
         }
      }
      
      if (passed)
      { 
          loader.show({dismiss:false});
          loader.text("Please wait..");

          this.account.prepareToken(()=>{
              const id = this.account.data.id;

              this.user.put('saving/fund/'+id, this.formpack).then((res:any)=>{
                const type = loader.status(res);

                if (type.error)
                {
                   loader.dismiss();

                   System.error(res.data.message);
                }
                else
                {
                  this.account.accountInfo(()=>{
                    loader.dismiss();
                    System.success(res.data.message, ()=>{
                      this.router.navigateByData({url : ['/savings'], data : []});
                    });
                  });
                }
            });
          }); 
      }
      else
      {
         System.error(message);
      }
  }

}
