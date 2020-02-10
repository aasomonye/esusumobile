import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../api/account.service';
import { UserService } from '../api/user.service';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.page.html',
  styleUrls: ['./withdraw.page.scss'],
})
export class WithdrawPage implements OnInit {
  page : string = 'Back';
  formpack : any = {};
  balance : any = "";

  constructor(public location : Location, public router : Router,
    public account : AccountService, private user : UserService)
  {
  }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  goto(page:string)
  {
    this.router.navigateByData({url : [page], data : []});
  }
}
