import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../api/account.service';
import { System } from 'src/lab/message';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

  text : any = 'Back';

  phoneVerified : any = 0;
  bankVerified : any = 0;
  kycVerified : any = 0;
  fundVerified : any = 0;
  incomplete : any = "Your account has been verified by us. You can request to be an agent if you want to.";
  incompleteArr : any = [];

  constructor(public location : Location,
    private router : Router,
    public service : AccountService) {
    
    const profile = this.service.data.profile.data;
    
    this.phoneVerified = profile.IsPhoneNumberConfirmed;
    this.bankVerified = profile.IsBankAccountConfirmed;
    this.kycVerified = profile.IsKYCComplete;

    let balance = parseFloat(this.service.data.balance.toString().replace(/[,]/,''));

    if (balance > 0)
    {
       this.fundVerified = 1;
    }
    else
    {
      this.incompleteArr.push('Fund wallet');
    }

    if (this.kycVerified == 0)
    {
       this.incompleteArr.push('KYC data');
    }

    if (this.bankVerified == 0)
    {
       this.incompleteArr.push('Bank account');
    }

    if (this.phoneVerified == 0)
    {
       this.incompleteArr.push('Phone number');
    }

    if (this.incompleteArr.length > 0)
    {
       const words = this.incompleteArr.join(', ');
       let add : string = "";

       if (this.incompleteArr.length < 4)
       {
          add = 'completely ';
       }

       this.incomplete = "Your account hasn't been verified "+add+"by us. Please submit your " + words + " if none is ongoing review to verify account.";
    }
    

    const data = this.router.getNavigatedData();
    if (data != null)
    { 
      if (data.indexOf('home') >= 0)
      {
         this.text = 'Skip';
      }
    }
    
  }

  ngOnInit() {
  }

  completed(message:string)
  {
     System.success(message);
  }

  goback()
  {
    if (this.text == 'Back')
    {
      this.location.back();
    }
    else
    {
      this.router.navigateByData({url : ['/dashboard'], data : []});
    }
  }

}
