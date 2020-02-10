import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';

@Component({
  selector: 'app-view-saving-report',
  templateUrl: './view-saving-report.page.html',
  styleUrls: ['./view-saving-report.page.scss'],
})
export class ViewSavingReportPage implements OnInit {

  formpack : any = {};
  pageTitle : string = '';
  hasNarration : boolean = false;
  reports : any = [];
  planCode : any = '';


  constructor(public router : Router, public location : Location,
    public user : UserService, public account : AccountService) {
       const data = this.router.getNavigatedData();
       this.pageTitle = data.plan;
       this.planCode = data.code;
       this.generateReport();
    }

  ngOnInit() {
  }

  filter()
  {
      const filter = Number(this.formpack.filter);

      if (filter > 0)
      {
          this.generateReport(filter);
      }
  }

  viewall(report:any)
  {
    report.plan = this.pageTitle;
    this.router.navigateByData({url : ['/view-all-plans'], data : report});     
  }

  goback()
  {
     this.location.back();
  }

  generateReport(limit:any=50)
  {
    loader.show({dismiss:false});
      loader.text("Loading "+this.pageTitle+" reports.");

      this.account.prepareToken(()=>{
          var send = this.user.get('saving/report/'+this.planCode+'?limit='+limit);

          send.then((res:any)=>{
              loader.dismiss();
              const type = loader.status(res);

              if (type.error)
              {
                System.error(res.data.message);
              }
              else
              {
                  this.reports = res.data.report;
                  this.hasNarration = true;
              }
          });
      });
  }
}
