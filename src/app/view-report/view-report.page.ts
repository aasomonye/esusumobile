import { Component, OnInit } from '@angular/core';
import { AccountService } from '../api/account.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { loader } from 'src/lab/loader';
import { UserService } from '../api/user.service';
import { System } from 'src/lab/message';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.page.html',
  styleUrls: ['./view-report.page.scss'],
})
export class ViewReportPage implements OnInit {

  endpoints : any = {'wallet' : 'report/wallet',
                     'voucher' : 'report/voucher',
                     'deposits' : 'report/deposits',
                     'withdrawals' : 'customer/withdrawal'};
  
  endpoint : string = '';
  pageTitle : string = 'Report';
  formpack : any = {};
  hasNarration : boolean = false;
  hasVoucher : boolean = false;
  hasWithdraw : boolean = false;
  reports : any = [];

  constructor(public account : AccountService, public router : Router,
    private location : Location, private user : UserService) {
     const data = this.router.getNavigatedData();
     this.endpoint = this.endpoints[data.page];
     this.pageTitle = data.page[0].toUpperCase();
     this.pageTitle += data.page.substring(1);
     this.formpack = new Function();
     this.generateReport();
  }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  filter()
  {
      const filter = Number(this.formpack.filter);

      if (filter > 0)
      {
          this.generateReport(filter);
      }
  }

  generateReport(limit:any=50)
  {
      loader.show({dismiss:false});
      loader.text("Loading "+this.pageTitle+" reports.");

      this.account.prepareToken((id:any)=>{
          var send = null;
          send = this.user.get(this.endpoint+'/'+id+'?limit='+limit);

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

                  if (this.pageTitle != 'Voucher')
                  {
                      this.hasNarration = true;
                  }
                  else if (this.pageTitle == 'Voucher')
                  {
                     this.hasVoucher = true;
                  }
                  else
                  {
                    this.hasWithdraw = true;
                  }
              }
          });
      });
  }

  reportInfo(report:any)
  {
     return report.AccountNumber;
  }

  viewall(report:any)
  {
     this.router.navigateByData({url : ['/view-all-plans'], data : report});
  }

  viewVoucher(report:any)
  {
    this.router.navigateByData({url : ['/view-vouchers'], data : report});
  }

  viewWithdraw(report:any)
  {
    this.router.navigateByData({url : ['/view-withdraw'], data : report});
  }

}
