import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { AccountService } from '../api/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileimage : string = '../../assets/images/profike.jpg';
  fullname : string = "";
  lastname : string = "";
  othername : string = "";
  profile : any = {};
  bank : any = {};
  bankConfirmed : boolean = false;

  constructor(private _sanitizer : DomSanitizer, private location : Location,
    public account : AccountService,
    private router : Router) {
      const data = this.account.data;

      this.fullname = data.profile.data.Othernames.trim() +' '+ data.profile.data.Lastname.trim();
      this.lastname = data.profile.data.Lastname.trim();
      this.othername = data.profile.data.Othernames.trim();
      this.profileimage = data.profileimage;

      this.profile = data.profile.data;

      if ('bank' in data)
      {
         if (data.bank !== null && data.bank !== undefined)
         {
            if (data.bank.status != 'Error')
            {
              this.bankConfirmed = true;
              this.bank = data.bank;
            }
         }
      }
      
    }

  ngOnInit() {
    this.profileimage = this.account.data.profileimage;
  }

  sanitizeimage(image:any)
  {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  goback()
  {
    this.location.back();
  }

  resetpassword()
  {
    this.router.navigateByData({url:['/resetpassword'], data : {refer : 'profile', email : this.profile.EmailAddress}});
  }
}
