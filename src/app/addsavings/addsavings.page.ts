import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AccountService } from '../api/account.service';
import { loader } from 'src/lab/loader';

@Component({
  selector: 'app-addsavings',
  templateUrl: './addsavings.page.html',
  styleUrls: ['./addsavings.page.scss'],
})
export class AddsavingsPage implements OnInit {

  plans : any = [];

  constructor(public router : Router, public location : Location,
    public account : AccountService) {

      this.plans = this.account.data.allplans.plans;
    }

  ngOnInit() {
  }

  getPlans()
  {
     loader.show();
     loader.text('Loading Plans');
     this.account.allplans(()=>{
        this.plans = this.account.data.savingsplans;
        loader.dismiss();
     });
  }

  trimText(text:any)
  {
     return text.substring(0,40) + '..';
  }

  form(plan:any)
  {
     this.router.navigateByData({url : ['/savingsform'], data:plan});
  }

  goback()
  {
    this.location.back();
  }

  gotoSavings()
  {
    // check savings 
    const data = this.account.data;
    if (data.plans == null)
    {
      // go to dashboard
      this.router.navigateByData({url:['/dashboard'], data:[]});
    }
    else
    {
      // go to savings
      this.router.navigateByData({url:['/savings'], data:[]});
    }
  }

}
