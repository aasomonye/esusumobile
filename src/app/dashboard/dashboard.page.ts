import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../api/account.service';
import { loader } from 'src/lab/loader';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  selector : any = {};
  fullname : string = "";
  balance : any = 0;
  accountNumber : any = "";
  plans : any = [];
  savings : number = 0;
  withdraws : any = {};
  reports : any = [];
  reportlimit : number = 10;
  hasReport : boolean = false;

  constructor(public element : ElementRef,
    public router : Router,
    public account : AccountService,
    public alertCtrl : AlertController) { 

    this.load();
    
  }

  // load report
  loadReport()
  {
    const allreport = this.account.data.allreport;
    
    let report = [];

    var i = 0;

    for (var rep in allreport)
    {
       if (i == this.reportlimit)
       {
          break;
       }
       else
       {
          report.push(allreport[rep]);
          i++;
       }
    }

    if (report.length > 0)
    {
       this.hasReport = true;
    }

    this.reports = report;
  }

  // reload wallet
  reload(event:any=null)
  {
     loader.show({dismiss:false});
     loader.text('Updating Wallet.');
     this.account.accountInfo(()=>{
        loader.dismiss(1000);
        this.load();
        if (event !== null)
        {
           event.target.complete();
        }
     });
  }

  // load more
  loadMore()
  {
     this.reportlimit += 10;
     this.loadReport();
  }

  ionViewWillEnter()
  {
    this.load();
  }

  load()
  {
    this.selector = Object.create(null);
    this.selector.get = (ele:string) => {
        return this.element.nativeElement.querySelector(ele);
    };
    this.selector.all = (ele:string) => {
        return this.element.nativeElement.querySelectorAll(ele);
    }

    const data = this.account.data;
    this.fullname = data.profile.data.Othernames.trim() +' '+ data.profile.data.Lastname.trim();
    this.balance = data.balance;
    this.accountNumber = data.accountNumber;
    
    // load report
    this.loadReport();
    
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

  async logout()
  {
      const alrt = await this.alertCtrl.create({
        header : 'Logout',
        message : 'You will be logged out from application.',
        buttons:[
          {
            text:'Cancel',
            role:'cancel'
          },
          {
            text:'Ok',
            role:'yes',
            handler:()=>{
              AppComponent.isloggedin = false;
              AppComponent.shouldgoBack = true;
              this.router.navigateByData({url:['/account'],data:{'logout':true}});
            }
          }
        ]
      });
      alrt.present();
  }
  
  gotoPlan(plan:any)
  {
    let plans = [];

    for(let i in this.account.data.plans)
    {
      let plan = Object.create(null);
      plan.name = i;
      plan.plan = this.account.data.plans[i];
      plans.push(plan);
    }
    
    this.router.navigateByData({url : ['/savingsinfo'], data : [plan.Name, plan.AvailableBalance, plan, plans]});
    
  }


  ngOnInit() {
     
  }

  goto(page:string)
  {
    this.router.navigateByData({url : [page], data:['Dashboard']});
  }

  viewall(report:any)
  {
     report.plan = 'dashboard';
     this.router.navigateByData({url : ['/view-all-plans'], data : report});
  }

  report(type:any)
  {
    this.router.navigateByData({url : ['/account-summary'], data : {goto : '/dashboard', type : type}});
  }

  report2()
  {
    this.router.navigateByData({url : ['/report'], data : {goto : '/dashboard'}});
  }
}
