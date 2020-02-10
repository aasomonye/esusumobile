import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';

@Component({
  selector: 'app-completeregistration',
  templateUrl: './completeregistration.page.html',
  styleUrls: ['./completeregistration.page.scss'],
})
export class CompleteregistrationPage implements OnInit {

  formpack : any = {};

  constructor(public router : Router, public location : Location,
    private user : UserService, private account : AccountService) {
     const pack = this.router.getNavigatedData();
    if (typeof pack == 'object')
    {
       if ('formpack' in pack)
       {
          this.formpack = pack.formpack;
       }
    }
  }

  ngOnInit() {
  }

  complete()
  {
    if ('DateOfBirth' in this.formpack &&
        this.formpack.DateOfBirth != "" && 
        'SecurityAnswer' in this.formpack &&
        this.formpack.SecurityAnswer != "")
    {
      let date = this.formpack.DateOfBirth;
      date = date.substr(0, date.indexOf('T'));
      date = date.split('-');

      let ndate = date[1] + '/' + date[2] +'/'+ date[0];
      this.formpack.DateOfBirth = ndate;
      this.formpack.AgentReferrerCode = ' ';
      
      loader.show({dismiss : false});

      this.user.post('user/register', this.formpack).then((res:any)=>{

        let type = loader.status(res);

        if (type.error)
        {
           loader.dismiss();

           let message = res.data.message;

           if (message == undefined)
           {
              message = 'Email address already in use.';
           }

           this.formpack.DateOfBirth = '';

           System.error(message, () => {
             this.router.navigateByData({url : ['/register'], data : {form : this.formpack}});
           });
        }
        else
        {
          loader.text('account created');
          loader.dismiss(1000);

           System.success(res.data.message, ()=>{
              this.router.navigateByData({url : ['/home'], data : {email : this.formpack.EmailAddress} });
           });
        }
        
      });
      
    }
    else
    {
       System.error('You are missing the security answer or date of birth');
    }
  }

  goto(page : string)
  {
     this.router.navigateByData({url : [page], data : []});
  }

  goback()
  {
    this.router.navigateByData({url : ['/register'], data : {formpack : this.formpack}});
  }

}
