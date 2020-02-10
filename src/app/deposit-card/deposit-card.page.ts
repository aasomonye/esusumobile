import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { System } from 'src/lab/message';
import { AccountService } from '../api/account.service';
import { loader } from 'src/lab/loader';
import { UserService } from '../api/user.service';
import { Router } from '@angular/router';
import {InAppBrowser, InAppBrowserEvent} from '@ionic-native/in-app-browser/ngx';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-deposit-card',
  templateUrl: './deposit-card.page.html',
  styleUrls: ['./deposit-card.page.scss'],
})
export class DepositCardPage implements OnInit {
  formpack : any = {};
  constructor(public location : Location,
    public account : AccountService,
    private user : UserService,
    public router : Router,
    public iab: InAppBrowser) {
    this.formpack = Object.create(null);
  }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  fund()
  {
     if (System.form())
     {

      // window['getpaidSetup']
         if (this.formpack.option != "")
         {
            let option = this.formpack.option;
            loader.show({dismiss:false});
            loader.text('Connecting..');

            AppComponent.pauseTimer = true;


            this.account.prepareToken(()=>{
                const id = this.account.data.id;
                this.user.get('deposit/'+option+'/'+id).then((res:any)=>{
                  const type = loader.status(res);

                  if (type.error)
                  {
                     loader.dismiss();

                     System.error(res.data.message);
                  }
                  else
                  {
                     const trans = this.account.data.profile.data;
                     loader.dismiss();

                     var PBFKey : string = "FLWPUBK-2fdb30357659fab544930b63d8516355-X";

                     const config = {
                      PBFPubKey: PBFKey,
                      customer_email: trans.EmailAddress,
                      customer_firstname: trans.Firstname,
                      customer_lastname: trans.Lastname,
                      custom_description: "Online Wallet Account",
                      custom_logo: "http://esusuonline.com.ng:90/public/assets/images/logo/esusuonline.png",
                      custom_title: "EsusuOnline",
                      amount: this.formpack.amount,
                      customer_phone: trans.PhoneNumber,
                      country: "NG",
                      currency: "NGN",
                      payment_method: "both",
                      txref: res.data.trxRef.trxRef,
                      pay_button_text : 'Fund Wallet'
                     };

                     var query = '?PBFPubKey='+PBFKey
                     +'&customer_email='+trans.EmailAddress
                     +'&customer_firstname='+trans.Firstname
                     +'&customer_lastname='+trans.Lastname
                     +'&amount='+this.formpack.amount
                     +'&customer_phone='+trans.PhoneNumber
                     +'&txref='+res.data.trxRef.trxRef;

                     const url = 'http://esusuonline.com.ng:90/payment.php'+query+'&id='+id;

                     if ('txref' in config && config.txref != null)
                     {
                        
                        // load inappbrowser
                        let browser = this.iab.create(url, '_blank', 'location=yes&footer=yes&closebuttoncaption=Return&hardwareback=no&hidenavigationbuttons=yes&hideurlbar=yes&zoom=no');
                        try
                        {
                          browser.on('loadstart').subscribe((event:InAppBrowserEvent)=>{
                              if (event.url.startsWith('http://esusuonline.com.ng:90/payment.php?response'))
                              {
                                 setTimeout(()=>{
                                    browser.close();
                                    AppComponent.pauseTimer = false;
                                 },3000);
                              }
                          });

                          browser.on('exit').subscribe(() => {
                              loader.show({dismiss:false});
                              loader.text('Updating wallet');
                              this.account.accountInfo(()=>{
                                  loader.dismiss();
                                  AppComponent.pauseTimer = false;
                                  this.router.navigateByData({url:['/dashboard'], data:[]});
                              });
                          }, err => {
                              
                              var balance = this.account.balance;

                              this.account.accountInfo(()=>
                              {
                                 AppComponent.pauseTimer = false;
                                 loader.dismiss();

                                 if (balance == this.account.balance)
                                 {
                                    System.error(err);
                                 }
                                 else
                                 {
                                    this.router.navigateByData({url:['/dashboard'], data:[]});
                                 }
                              });
                              
                          })
                        }
                        catch(e)
                        {
                            console.log(e);
                        }

                        
                     }
                     else
                     {
                        AppComponent.pauseTimer = false;
                        this.router.navigateByData({url:['/dashboard'], data:[]});
                     }
                     
                  }
                });
            }); 
         }
     }
  }
}
