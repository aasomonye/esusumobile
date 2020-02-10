import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../api/account.service';
import { AlertController } from '@ionic/angular';
import { loader } from 'src/lab/loader';
import { UserService } from '../api/user.service';
import { System } from 'src/lab/message';

declare var cordova;

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.page.html',
  styleUrls: ['./vouchers.page.scss'],
})
export class VouchersPage implements OnInit {

  vouchers : any = {};
  s : string = '';
  loaded : boolean = false;

  constructor(private location : Location,
    private router : Router,
    public account : AccountService,
    private alertc : AlertController,
    private user : UserService) {
      const data = this.router.getNavigatedData();
      this.loaded = true;
      this.vouchers = data.vouchers;
      if (this.vouchers.length > 1)
      {
          this.s = 's';
      }
    }

  ngOnInit() {
  }

  async copyCode(code:string, event:any)
  {
      const alertc = await this.alertc.create({
        header : 'Copy Voucher',
        message : 'Do you want to copy this voucher code?',
        buttons : [
          {
            role : 'yes',
            text : 'Yes',
            handler : () => {
              if (typeof cordova === 'object')
              {
                 cordova.plugins.clipboard.copy(code);
              }else
              {
                this.copyTextToClipboard(code);
              }
            }
          },
          {
            role : 'cancel',
            text : 'No'
          }
        ]
      });

      alertc.present();
  }

  // send 
  send()
  {
     loader.show();
     loader.text('sending..');
     this.account.prepareToken((id:any)=>{
        this.user.post('agentVouchers/'+id, {vouchers : this.vouchers}).then((res:any)=>{
          const type = loader.status(res);

          if (type.error)
          {
            loader.dismiss();

            System.error(res.data.message);
          }
          else
          { 
              loader.dismiss();
              System.success(res.data.message);
          }
        }); 
     });
  }

  copyTextToClipboard(text) {
    var textArea : any = document.createElement("textarea");
  
    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
  
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';
  
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;
  
    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
  
    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';
    textArea.value = text;
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
  
    document.body.removeChild(textArea);
  }

  goback()
  {
     this.location.back();
  }

}
