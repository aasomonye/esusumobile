import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../api/account.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-all-plans',
  templateUrl: './view-all-plans.page.html',
  styleUrls: ['./view-all-plans.page.scss'],
})
export class ViewAllPlansPage implements OnInit {
  report : any = [];
  hideplan : any = false;

  constructor(private router : Router,
    public account : AccountService,
    public location : Location) {
    const data : any = this.router.getNavigatedData();
    this.report = data;
    if (data.plan == 'dashboard')
    {
       this.hideplan = true;
    }
  }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

}
