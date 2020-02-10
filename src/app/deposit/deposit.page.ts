import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../api/account.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit {
  page : string = 'Back';

  constructor(public location : Location,
    public router : Router,
    public account : AccountService) {
    const page = this.router.getNavigatedData();
    
  }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  goto(page:string)
  {
    this.router.navigateByData({url : [page], data:['Deposit']});
  }
}
