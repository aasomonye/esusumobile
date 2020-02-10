import { Component, ViewChildren, QueryList } from '@angular/core';
import { Platform, ModalController, IonRouterOutlet, AlertController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AccountService } from './api/account.service';
import { System } from 'src/lab/message';
import { UserService } from './api/user.service';
import { InfobarComponent } from './components/infobar/infobar.component';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  
  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  modaldisplayed = 0;
  openedModal : any = [];
  timeoutUser : any;
  setTime : any = null;
  public static isloggedin : boolean = false;
  public static shouldgoBack : boolean = true;
  public static pauseTimer : boolean = false;
  public static devicehash : any = null;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private statusBar: StatusBar,
    public modalCtrl: ModalController,
    private alertcrtl: AlertController,
    private router: Router,
    public toastController: ToastController,
    public account : AccountService) {

    // Initialize app
    this.initializeApp();

    // Initialize BackButton Eevent.
    this.backButtonEvent();

    // manage timeout

}

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      //this.splashScreen.hide();

      this.router.events.subscribe((event:any)=>{
          if (event instanceof NavigationEnd)
          {
            const url = this.router.url;

            // check wallet balance
            var bal = this.account.data.balance;

            // !un
            if (bal !== undefined && InfobarComponent.included === false)
            {
                // check
                if (this.setTime == null)
                {
                   this.managetimeout();
                }
                else
                {
                  var date = new Date();
                  var min = date.getTime();

                  if (this.setTime > min)
                  {
                     // add more time
                     this.setTime = date.setMinutes(date.getMinutes() + 2);
                  }
                }
            }

            //  ensure we are not in verification page
            if (url != '/verification' 
            && url != '/account' 
            && url != '/deposit-card' 
            && url != '/deposit-voucher'
            )
            {
                // has user clicked on dismiss previously?
                // show alert
                if (AppComponent.isloggedin === true)
                {
                  if (bal !== undefined)
                  {
                    // loggedin
                    bal = bal.replace(/[,]/,'');

                    // extract
                    bal = bal.substr(0, bal.indexOf('.'));

                    if (bal !== false && parseInt(bal) < 5)
                    { 
                      this.modaldisplayed = 1;
                      this.showReminder();
                    }
                  }
                }
            }

            this.backButtonEvent();
          }
      });
    });
  }

  managetimeout()
  {
      this.timeoutUser = setInterval(()=>{

          // get timestamp
          if (this.setTime == null)
          {
            // set time
            var date = new Date();
            this.setTime = date.setMinutes(date.getMinutes() + 2);
          }
          else
          {
             // get current minute
             var date = new Date();
             var min = date.getTime();

             if (min > this.setTime)
             {
                if (AppComponent.pauseTimer === false)
                {
                  this.closeapp();
                }
                else
                {
                   this.setTime = date.setMinutes(date.getMinutes() + 2);
                }
             }
          }
      },2000);
  }

  closeapp()
  {
    // check running services
    const running = UserService.runningService;

    if (running === false)
    {
        clearInterval(this.timeoutUser);
        this.setTime = null;

        System.error('Session Expired..', ()=>{
          clearInterval(this.timeoutUser);
          AppComponent.isloggedin = false;
          this.router.navigateByData({url : ['/account'], data:[]});
        });
    }
  }

  async showReminder()
  {
      const reminder = await this.alertCtrl.create({
        header : "Insufficient Funds",
        message : "Your account balance is too low, please fund your wallet to continue or dismiss notification to fund later.",
        buttons : [
            {
              role : 'yes',
              text : 'Fund',
              handler : async () => {
                  // fund plan
                  const options = await this.alertCtrl.create({
                    header : 'Fund wallet',
                    message : 'How would you like to fund your wallet?',
                    buttons : [
                      {
                        role : 'card',
                        text : 'Card',
                        handler : () => {
                          reminder.dismiss();
                          this.router.navigateByData({url : ['/deposit-card'], data : []});
                       }
                      },
                      {
                        role : 'voucher',
                        text : 'Voucher',
                        handler : () => {
                          reminder.dismiss();
                          this.router.navigateByData({url : ['/deposit-voucher'], data : []});
                       }
                      }
                    ]
                  })
                  options.present();
              }
            },
            {
              role : 'No',
              text : 'Dismiss',
              handler : () => {
                  // save dismiss option in storage.
                  reminder.dismiss();
                  this.modaldisplayed = 0;
              }
            }  
        ]
      });
      if (this.modaldisplayed == 1)
      {
        this.openedModal.push(reminder);

        // close previous modal
        if (this.openedModal.length > 0)
        {
           this.openedModal.forEach((rem:any)=>{
              rem.dismiss();
           });
        }

        // show now
        reminder.present();
      }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Press back again to exit App.',
      duration: 2000,
      position : "middle"
    });
    toast.present();
  }

  async promptClose()
  {
     const al = await this.alertcrtl.create({
       header : 'Exit application',
       message : 'Are you sure you want to exit application?',
       buttons : [
         {
           role : 'yes',
           text : 'Yes',
           handler : () => {
              AppComponent.isloggedin = false;
              AppComponent.shouldgoBack = true;
              navigator['app'].exitApp();
           }
         },
         {
           role : 'cancel',
           text : 'No'
         }
       ]
     });

     al.present();
  }

  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
        this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
          if (this.router.url == '/home' || this.router.url == '/account' || this.router.url == '/' || this.router.url == '/dashboard') {
            this.promptClose();
          }
          else if (outlet && outlet.canGoBack()) {
            if (AppComponent.shouldgoBack)
            {
              outlet.pop();
            }
            else
            {
              // take user to dashboard
              if (InfobarComponent.included === false)
              {
                 this.router.navigateByData({url:['/dashboard'], data:[]});
              }
            }
          }
        });
    });
  }

}
