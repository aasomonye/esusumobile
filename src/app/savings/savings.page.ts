import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';
import { loader } from 'src/lab/loader';
import { System } from 'src/lab/message';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.page.html',
  styleUrls: ['./savings.page.scss'],
})
export class SavingsPage implements OnInit {

  public width : number = 0;
  page : string = 'Back';
  plans : any = [];
  havePlans : boolean = false;
  formpack : any = {};
  reports : any = [];
  reportlimit : number = 10;
  hasReport : boolean = false;
  allreports : any = {};

  constructor(public element : ElementRef,
    public router : Router, 
    public location : Location,
    public user : UserService,
    public account : AccountService) {
      this.formpack = Object.create(null);
  }
  
  ionViewDidLoad()
  {
  }

  ionViewDidEnter()
  {
    
  }

  getCode(code:any)
  {
     let codeToString = code.toString().substr(-4,4);
     return codeToString;
  }

  ionViewWillEnter()
  {
    this.loadplans();
  }
  
  ngOnInit() {
      //this.loadplans();
  }

  viewall(report:any)
  {
     this.router.navigateByData({url : ['/view-all-plans'], data : report});
  }

  setwrapper()
  {
    const savingslist = this.element.nativeElement.querySelectorAll('.savings-list');
    [].forEach.call(savingslist, ()=>{
        this.width += 160 + 10;
    });

    // wrapper
    const wrapper = this.element.nativeElement.querySelector('.savings-plan-wrapper');
    if (wrapper != null)
    {
      wrapper.setAttribute('style', 'width:'+this.width+'px');
    }
  }

  loadplans()
  {
    const data = this.account.data;
    if (data.plans == null)
    {
      this.router.navigateByData({url:['/addsavings'], data : []});
    }
    else
    {
      let plans = [];
      let reports = [];

      for (var i in data.plans)
      {
        for (var x in data.plans[i])
        {
          let plan = Object.create(null);
          plan.name = x;
          plan.plan = data.plans[i][x];
          plans.push(plan);
        }
      }
     
      this.plans = plans;
      var report = data.allplansreport.report;

      for (let x in report)
      {
        reports.push(report[x]);
      }

      this.allreports = reports;
      this.loadReport();
      this.havePlans = true;
    }
  }

  // load report
  loadReport()
  {
    const allreport = this.allreports;
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

  // load more
  loadMore()
  {
     this.reportlimit += 10;
     this.loadReport();
  }

  dismiss(total:any, id:any)
  {
     if (id == total)
     {
        loader.dismiss();
     }
  }

  fund()
  {
      if (System.form('.fund-form-inner'))
      { 
          loader.show({dismiss:false});

          this.account.prepareToken(()=>{
              const id = this.account.data.id;
              const balance = Number(this.account.data.balance);

              if (this.formpack.Amount <= balance && balance > 500)
              {
                this.user.put('saving/fund/'+id, this.formpack).then((res:any)=>{
                    const type = loader.status(res);
                    loader.dismiss();

                    if (type.error)
                    {
                      System.error(res.data.message);
                    }
                    else
                    {
                      System.success(res.data.message).close(()=>{
                          for (var i in this.formpack)
                          {
                            this.formpack[i] = '';
                            this.loadplans();
                          }
                      });
                    }
                });
              }
              else
              {
                 loader.text('insufficient wallet balance');
                 loader.dismiss(1000, ()=>{
                    this.router.navigateByData({url : ['/deposit-card'], data : []});
                 });
                 
              }
          }); 
      }
      else
      {
         System.error('All input fields are required');
      }
  }

  savings(plan:any,index:number=null)
  {
     this.router.navigateByData({url : ['/savingsinfo'], data : [plan.name, plan.plan.AvailableBalance, plan, this.plans, index]});
  }

  goback()
  {
    this.location.back();
  }

}
