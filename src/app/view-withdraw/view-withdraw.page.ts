import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AccountService } from '../api/account.service';

@Component({
  selector: 'app-view-withdraw',
  templateUrl: './view-withdraw.page.html',
  styleUrls: ['./view-withdraw.page.scss'],
})
export class ViewWithdrawPage implements OnInit {

  report : any = {};

  constructor(public router : Router, public location : Location,
    public account : AccountService) {
      this.report = this.router.getNavigatedData();
    }

  ngOnInit() {
  }

  goback()
  {
     this.location.back();
  }

}
