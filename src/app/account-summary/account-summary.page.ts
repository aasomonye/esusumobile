import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AccountService } from '../api/account.service';
import { Storage } from '@ionic/storage';
import { loader } from 'src/lab/loader';
import { Router } from '@angular/router';
import { UserService } from '../api/user.service';
import { System } from 'src/lab/message';


@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.page.html',
  styleUrls: ['./account-summary.page.scss'],
})
export class AccountSummaryPage implements OnInit {

  savingsActive : boolean = true;
  savings : any = {};
  withdrawals : any = {};
  savingsLoaded : boolean = false;
  withdrawalsLoaded : boolean = false;
  failedto : string = '/dashboard';
  withdrawalsLimit : number = 3;
  savingsLimit : number = 3;
  showWithdrawalsLoad : boolean = false;
  showSavingsLoad : boolean = false;
  filterfor : string = 'savings';
  pagesize : any = '';
  allloaded : boolean = false;
  savingsChanged : string = '';
  withdrawalsChanged : string = '';
  active : string = 'savings';
  activeText : string = 'Savings';
  other : string = 'withdrawals';
  otherText : string = 'Withdrawals';

  constructor(private location : Location, public account : AccountService,
    private router : Router,
    private user : UserService,
    private storage : Storage) {
      const data = this.router.getNavigatedData();
       if ('goto' in data)
       {
           this.failedto = data.goto;
       }

       this.savingsChanged = 'checked';

       const accoun = this.account;

       if ('type' in data)
       {
          if (data.type == 'withdrawals')
          {
             this.savingsChanged = '';
             this.withdrawalsChanged = 'checked';
          }
       }

       this.withdrawals = accoun.data.withdrawal.report;

       if (this.withdrawals.length > 0)
       {
          if ('type' in data)
          {
            if (data.type == 'withdrawals')
            {
                this.active = this.other;
                this.activeText = this.otherText;
                this.other = 'savings';
                this.otherText = 'Savings';
                this.withdrawalsLoaded = true;
                this.allloaded = true;
            }
          }
       }

       this.allloaded = true;
    }

  ngOnInit() {
  }

  status(code:any)
  {
    if (code == '2')
    {
       return 'Approved';
    }
    else if (code == '1')
    {
      return 'Pending';
    }
    else
    {
      return 'Canceled';
    }
  }

  segmentChanged(e:any)
  {
     if (e.detail.value != 'savings')
     {
        this.savingsActive = false;
        this.toggle('withdrawals');
        this.filterfor = 'withdrawals';
     }
     else
     {
        this.savingsActive = true;
        this.toggle('savings');
        this.filterfor = 'savings';
     }

  }

  goback()
  {
     this.location.back();
  }

  

  toggle(wrapper:any='')
  {
    let report : any;

     if (wrapper != '')
     {
        let wrap = document.querySelector('.'+wrapper);
        let max = 50;
        let intv = setInterval(()=>{
          report = wrap.querySelectorAll('.table-report');
          if (report.length > 0 || max <= 0)
          {
             clearInterval(intv);
             this.toggleList(report);
          }
          max--;
        },1);
        
     }
     else
     {
        report = document.querySelectorAll('.table-report');
        this.toggleList(report);
     }

     this.filterbox();
  }

  filterbox()
  {
     let fb : any = document.querySelectorAll('.size-filter-btn');
     let sc : any = document.querySelectorAll('.size-filter-control');

     setTimeout(()=>{
         if (sc != null && sc.length > 0)
         {
            [].forEach.call(sc, (s:any)=>{
               s.style.opacity = 1;
            });
         }
     },500);

     [].forEach.call(fb, (e:any)=>{
         
         let fl : any = e.firstElementChild;
         let fbox : any = e.nextElementSibling.firstElementChild;
         let fboxwrap : any = e.nextElementSibling;

         e.addEventListener('click', ()=>{
            if (!e.hasAttribute('data-clicked'))
            {
               fboxwrap.style.display = 'flex';
               fl.style.opacity = 0;
               setTimeout(()=>{
                  e.parentNode.classList.add('show-box');
                  fl.classList.add('close');
                  e.setAttribute('data-clicked', true);
                  setTimeout(()=>{
                     fl.style.opacity = 1;
                     fbox.style.display = 'flex';
                     setTimeout(()=>{
                        fbox.style.opacity = 1;
                     },100);
                  },400);
               },600);
            
            }
            else
            {
               fbox.style.opacity = 0;
               fl.style.opacity = 0;

               setTimeout(()=>{
                  fbox.style.display = 'none';
                  fboxwrap.style.display = 'none';
                  e.parentNode.classList.remove('show-box');

                  setTimeout(()=>{
                     fl.classList.remove('close');
                     e.removeAttribute('data-clicked');

                     setTimeout(()=>{
                        fl.style.opacity = 1;
                     },100);

                  },500);

               },500);
               
            }
         });
     });
  }

  toggleList(report:any)
  {
    if (report.length > 0)
     {
      [].forEach.call(report, (e:any)=>{
          // look for toogle button
          let toogle : any = e.querySelector('.toggle-list');
          if (toogle != null)
          {
             toogle.addEventListener('click', (y:any)=>{
              let list : any = e.querySelector('.table-list');
                if (!e.hasAttribute('data-toggled'))
                {
                   let titles : any = list.querySelectorAll('.table-title');
                   let height : number = 0;
                   [].forEach.call(titles, (x:any)=>{
                      height += (x.offsetHeight + 10);
                   });

                   height += (y.target.offsetHeight + 50);

                   e.style.height = height + 'px';
                   e.setAttribute('data-toggled', true);
                   toogle.innerText = 'Collapse';
                }
                else
                {
                  e.style.height = '129px';
                  toogle.innerText = 'Expand';
                  e.removeAttribute('data-toggled');
                }
             });

             toogle.previousElementSibling.addEventListener('click', ()=>{
                  toogle.click();
             });
          }
      });
     }
  }

}
