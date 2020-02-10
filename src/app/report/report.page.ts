import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../api/account.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  constructor(public location : Location, private router : Router,
    public account : AccountService) { }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  form(id:any)
  {
     const requestType = ['wallet', 'voucher', 'withdrawals','deposits'];
     this.router.navigateByData({url:['/view-report'], data : {'page' : requestType[id-1]}});
  }
}
