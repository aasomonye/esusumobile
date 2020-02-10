import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { System } from 'src/lab/message';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss', '../../assets/styles/reset.scss'],
})
export class RegisterPage implements OnInit {

  formpack : any = null;

  constructor(public router : Router, public location : Location) {
      this.load();
  }      

  ngOnInit() {
   this.load();
  }

  ionViewDidEnter()
  {
    this.load();
  }

  load()
  {

   this.formpack = Object.create(null);
   const data = this.router.getNavigatedData();
   if (typeof data == 'object' && 'form' in data)
   {
      if (typeof data.form == 'object')
      {
         this.formpack = data.form;
      }
      else
      {
         this.formpack = Object.create(null);
      }
   }
  }

  goto(page : string)
  {
     this.router.navigateByData({url : [page], data : []});
  }

  continue()
  {
     if (System.form())
     {
        if (this.formpack.Password == this.formpack.ConfirmPassword)
        {
           if (this.formpack.PhoneNumber.toString().length == 11)
           {
              if (this.formpack.Password.toString().length >= 6)
              {
                  this.router.navigateByData({url : ['/completeregistration'], data : {formpack : this.formpack}});
              }
              else
              {
                 System.error('Password too weak. Must be upto 6 characters.', ()=>{
                  this.formpack.Password = '';
                  this.formpack.ConfirmPassword = '';
                });
              }
           }
           else
           {
              System.error('Invalid Phone Number. must be 11 character length.');
           }
        }
        else
        {
           System.error('Password does not match', ()=>{
              this.formpack.Password = '';
              this.formpack.ConfirmPassword = '';
           });
        }
     }
  }

  goback()
  {
    this.location.back();
  }
}
