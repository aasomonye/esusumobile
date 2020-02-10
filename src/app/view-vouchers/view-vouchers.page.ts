import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../api/account.service';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';

declare var cordova;

@Component({
  selector: 'app-view-vouchers',
  templateUrl: './view-vouchers.page.html',
  styleUrls: ['./view-vouchers.page.scss'],
})
export class ViewVouchersPage implements OnInit {

  report : any = [];
  code : string = '';

  constructor(public router : Router,
    public account : AccountService,
    private location : Location,
    private alertc : AlertController) {
    const data = this.router.getNavigatedData();
    this.report = data;
    this.code = data.VoucherCode;
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

  ngOnInit() {
  }

  goback()
  {
     this.location.back();
  }

}
