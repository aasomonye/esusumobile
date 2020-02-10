import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AccountService } from '../api/account.service';
import { Storage } from '@ionic/storage';
import { loader } from 'src/lab/loader';
import { Router } from '@angular/router';
import { UserService } from '../api/user.service';
import { System } from 'src/lab/message';

@Component({
  selector: 'app-agent-report',
  templateUrl: './agent-report.page.html',
  styleUrls: ['./agent-report.page.scss'],
})
export class AgentReportPage implements OnInit {

  voucherActive : boolean = true;
  vouchers : any = {};
  wallets : any = {};
  vouchersLoaded : boolean = false;
  walletLoaded : boolean = false;
  failedto : string = '/agent';
  walletLimit : number = 3;
  voucherLimit : number = 3;
  showWalletLoad : boolean = false;
  showVoucherLoad : boolean = false;
  filterfor : string = 'voucher';
  pagesize : any = '';
  allloaded : boolean = false;

constructor(private location : Location, public account : AccountService,
    private router : Router,
    private user : UserService,
    private storage : Storage) {
       const data = this.router.getNavigatedData();
       if ('goto' in data)
       {
           this.failedto = data.goto;
       }
  }

  segmentChanged(e:any)
  {
     if (e.detail.value != 'voucher')
     {
        this.voucherActive = false;
        this.toggle('wallet');
        this.filterfor = 'wallet';
     }
     else
     {
        this.voucherActive = true;
        this.toggle('voucher');
        this.filterfor = 'voucher';
     }

  }

  filter()
  {
     if (Number(this.pagesize) > 1)
     {
         let fb : any = document.querySelectorAll('.size-filter-btn');
         [].forEach.call(fb, (e:any)=>{
            e.click();
         });

         loader.show({dismiss:false});

         this.report(this.filterfor, Number(this.pagesize), false, '', (res:any)=>{
            if ('report' in res.data)
            {
               const type = loader.status(res);

               if (type.error)
               {
                  if (this.user.alive(res.data.message))
                  {
                     System.error(res.data.message);
                  }
               }
               else
               {
                     let data = Object.create(null);

                     if (this.filterfor == 'voucher')
                     {
                        this.voucherLimit = this.pagesize;
                        data.voucherreport = res.data.report;
                        data.walletreport = this.account.data.walletreport;
                     }
                     else
                     {
                        this.walletLimit = this.pagesize;
                        data.walletreport = res.data.report;
                        data.voucherreport = this.account.data.voucherreport;
                     }

                     this.loadall(data, false);
                     this.toggle(this.filterfor);
                     this.pagesize = '';
               }
            }
            else
            {
               loader.text('No report found');
               loader.dismiss(1000);
            }
         });
         
     }

  }

  report(type:string,length:number=20, load:boolean = false, extra:string="", callback:any="")
  {

    if (load === true)
    {
      loader.show({dismiss:false});
    }

    const tt = type;

    this.account.prepareToken(()=>{
      this.storage.get('id').then((id)=>{
        let typelink = 'report/'+type+'/';
  
        let path = typelink+id+'?limit='+length+extra;
  
        this.user.get(path).then((res:any)=>{
            if (typeof callback == 'function')
            {
              callback.call(Object.create(null), res);
            }
        });
      });
    });

    return this;
  }

  loadmore(type:string)
  {
     loader.show({dismiss:false});

     setTimeout(()=>{
      if (type == 'wallet')
      {
         this.walletLimit += 3;
      }
      else if (type == 'voucher')
      {
         this.voucherLimit += 3;
      }
      this.loadall();
     },1000);
  }

  ngOnInit() {
    loader.show({dismiss:false});
    this.loadall();
  }

  loadall(dat:any={}, reload:boolean=true)
  {
      loader.text('Generating Report');

      let data : any = {};

      if ('voucherreport' in dat && 'walletreport' in dat)
      {
         data = dat;
      }
      else
      {
         data = this.account.data;  
      }

      if ('voucherreport' in data && 'walletreport' in data)
      {
         if (data.voucherreport.length > 0)
         {
            const voucher : any = [];
            let i : any = 0;

            for(i in data.voucherreport)
            {
               if (i < this.voucherLimit)
               {
                  voucher.push(data.voucherreport[i]);
               }
            }

            this.vouchers = voucher;
            this.vouchersLoaded = true;

            if (data.voucherreport.length > 3)
            {
               this.showVoucherLoad = true;
            }
         }

         if (data.walletreport.length > 0)
         {
            const wallet : any = [];
            let i : any = 0;

            for(i in data.walletreport)
            {
               if (i < this.walletLimit)
               {
                  wallet.push(data.walletreport[i]);
               }
            }

            this.wallets = wallet;

            this.walletLoaded = true;

            if (data.walletreport.length > 3)
            {
               this.showWalletLoad = true;
            }
         }

         loader.dismiss();
         setTimeout(()=>{
            this.allloaded = true;
         },600);

      }
      else
      {
         loader.text('No Report found');
         loader.dismiss(1000);

         setTimeout(()=>{
            this.router.navigateByData({url:[this.failedto], data:[]});
         },1400);
         
      }

      if (reload === true)
      {
         this.toggle();
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
