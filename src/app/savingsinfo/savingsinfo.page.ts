import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AccountService } from '../api/account.service';
import { UserService } from '../api/user.service';
import { loader } from 'src/lab/loader';
import { System } from 'src/lab/message';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-savingsinfo',
  templateUrl: './savingsinfo.page.html',
  styleUrls: ['./savingsinfo.page.scss'],
})
export class SavingsinfoPage implements OnInit {
  title : string = "";
  amount : any;
  width : number = 0;
  plan : any = {};
  plans : any = {};
  reports : any = [];
  hasReport : boolean = false;
  interest : any = 0;
  isActive : boolean = true;
  planid : any = null;

  constructor(public router : Router, private element : ElementRef,
    private location : Location,
    public account : AccountService,
    private user : UserService,
    private alertCtrl : AlertController) {
     const data : any = this.router.getNavigatedData();
     this.planInfo(data);
  }

  planInfo(data:any)
  {
      this.title = data[0];
      this.amount = data[1];

      if ('plan' in data[2])
      {
         this.plan = data[2].plan;
      }
      else
      {
         this.plan = data[2];
      }

      this.plans = data[3];
      this.planid = data[4];

      if (this.plan.Status == 'Closed')
      {
         this.isActive = false;

         if (this.plan.TransferToWalletOnMaturity == 1)
         {
            this.amount = '0.00';
         }
      }

      this.report();
  }

  ionViewWillEnter()
  {
      this.reloadPlan();
  }

  reloadPlan()
  {
      if (this.planid != null)
      {
         const data = this.account.data;

         let plans = [];

         for (var i in data.plans)
         {
            if (i == this.planid)
            {
               for (var x in data.plans[i])
               {
                  let plan = Object.create(null);
                  plan.name = x;
                  plan.plan = data.plans[i][x];
                  plans.push(plan);
               }

               break;
            }
         }

         this.savings(plans[0]);
      }
  }

  goback()
  {
     this.location.back();
  }

  planerror()
  {
     System.error('This plan has been closed. Funding cannot be performed on this plan.');
  }

  viewall(report:any)
  {
     this.router.navigateByData({url : ['/view-all-plans'], data : report});
  }

  ngOnInit() {
    setTimeout(()=>{
      const savingslist = this.element.nativeElement.querySelectorAll('.savings-list');
      [].forEach.call(savingslist, (e)=>{
          this.width += 160 + 10;
      });
  
      // wrapper
      const wrapper = this.element.nativeElement.querySelector('.savings-plan-wrapper');
      if (wrapper != null)
      {
        wrapper.setAttribute('style', 'width:'+this.width+'px');
      }
    },3000);
  }

  quicksave()
  {
      if (this.isActive)
      {
         this.router.navigateByData({url:["/quicksave"], data : this.plan});
      }
      else
      {
         this.planerror();
      }
  }

  async close()
  {
      const closeapp = await this.alertCtrl.create({
         header : "Close "+this.title,
         message : "Are you sure you want to close your "+this.title+" savings plan? Cancellation fee will apply.",
         buttons : [
            {
               role : 'yes',
               text : 'Yes',
               handler : () => {
                  // close plan
                  loader.show({dismiss:false});
                  loader.text("Please wait..");

                  const data = {
                     CustProdID : this.plan.ID,
                     CustomerID : this.plan.CustomerID,
                     Balance : this.amount,
                     Status : 'Active',
                     MinimumBalance : this.plan.MinimumBalance,
                     InterestRate : this.interest,
                     ProductName : this.title,
                     MySavingsCode : this.plan.Code,
                     CancellationFee : '500.00'
                  };

                  this.account.prepareToken(()=>{
                     this.user.put('saving/close', data).then((res:any)=>{
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
                           loader.text('Plan Closed. Updating..');
                           this.isActive = false;

                           this.account.accountInfo(()=>{
                              loader.dismiss();
                              this.plan.Status = 'Closed';
                              System.success(res.data.message).close(()=>{
                                 this.router.navigateByData({url:['/savings'], data:{}});
                              });
                           });
                        }
                     });
                  });
               }
            },
            {
               role : 'No',
               text : 'No'
            }  
         ]
      });
      closeapp.present();
  }

  async autosave()
  {
     if (this.isActive)
     {
         let StandingOrder = this.plan.StandingOrder.toString().replace(/[,]/,'');

         let balance = this.account.data.balance.toString().replace(/[,]/,'');
       
         const alert = await this.alertCtrl.create({
            header: 'Auto Save',
            message: '₦'+StandingOrder+' would be added to your '+this.title+' saving plan from your wallet. Press "Okay" to acknowledge or "Cancel" to close.',
            buttons: [
               {
               text: 'Cancel',
               role: 'cancel',
               cssClass: 'secondary',
               handler: () => {
               }
               }, {
               text: 'Okay',
               handler: async () => {
                  if (parseFloat(balance) >= parseFloat(StandingOrder))
                  {
                     loader.show({dismiss:false});
                     loader.text("Please wait..");

                     this.account.prepareToken((id:any)=>{
                        this.user.put('saving/fund/'+id, {Amount:parseFloat(StandingOrder),savingsPlanID:this.plan.ID,Description:'Auto Save'}).then((res:any)=>{
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
                                 this.reloadPlan();
                                 System.success(res.data.message);
                              });
                           }
                        });
                     });
                  }
                  else
                  {
                     const err = await this.alertCtrl.create({
                        header : 'Auto Save',
                        message : 'Insufficient Funds in your wallet',
                        buttons : ['Ok']
                     });
                     err.present();
                  }
               }
               }
            ]
         });
      
         await alert.present();
     }
     else
     {
        this.planerror();
     }
  }


  savings(plan:any)
  {
     this.title = plan.name;
     
     if ('plan' in plan)
     {
        this.amount = plan.plan.AvailableBalance;
        this.plan = plan.plan;
     }
     else
     {
       this.amount = plan.AvailableBalance;
       this.plan = plan;
     }

     this.report();
  }

  report()
  {
     const accountNumber = this.plan.Code;

     const data = this.account.data.allplansreport.report;

     let reports = [];
     const title = this.title;

     for (var x in data)
     {
        if (data[x].AccountNumber == accountNumber)
        {
          data[x].plan = title;
          reports.push(data[x]);
        }
     }

     this.interest = this.account.data.interest.interest[accountNumber];

     this.reports = reports;

     if (reports.length > 0)
     {
       this.hasReport = true;
     }
  }

  viewReport()
  {
      const code = this.plan.Code;
      this.router.navigateByData({url:["/view-saving-report"], data : {code : code, plan : this.title}});
  }

  fund()
  {
     if (this.isActive)
     {
         const id = this.plan.ID;
         this.router.navigateByData({url:["/fund-savings"], data : id.toString()});
     }
     else
     {
        this.planerror();
     }
  }

}
