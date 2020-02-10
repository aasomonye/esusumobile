import { Component, OnInit } from '@angular/core';
import { AccountService } from '../api/account.service';
import { UserService } from '../api/user.service';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phoneform',
  templateUrl: './phoneform.page.html',
  styleUrls: ['./phoneform.page.scss'],
})
export class PhoneformPage implements OnInit {

  phonenumber : string = '';
  token : string = '';
  generatedToken : any = false;

  constructor(public account : AccountService, public user : UserService, public router : Router) {
    const data = this.account.data;
    this.phonenumber = data.profile.data.PhoneNumber;
    this.sendToken();
  }

  ngOnInit(){}

  sendToken() {
    loader.show();
    loader.text('Generating Validation Token');

    this.account.prepareToken((id:any)=>{
        this.user.get('verify/phone/'+id).then((res:any)=>{
            this.generatedToken = res.data.message.GeneratedToken;
            loader.dismiss();
        });
    });
  }

  continue()
  {
      if (this.token.toString().length == 4)
      {
          loader.show();
          loader.text('Processing..');

          this.account.prepareToken((id:any)=>{
              this.user.post('verify/phone/'+id,{
                EnteredToken : this.token,
                GeneratedToken : this.generatedToken
              }).then((res:any)=>{
                  loader.dismiss();
                  const type = loader.status(res);
                  if (type.error)
                  {
                    this.token = '';
                    System.error(res.data.message);
                  }
                  else
                  {
                    System.success(res.data.message, ()=>{
                      this.router.navigateByData({url : ['/verification'], data : ['home']});
                    });
                  }
              });
          });
      }
      else
      {
         System.error("Invalid Token length.");
      }
  }

}
