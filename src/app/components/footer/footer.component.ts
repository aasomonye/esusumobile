import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AccountService } from 'src/app/api/account.service';
import { InfobarComponent } from '../infobar/infobar.component';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  selector : any = {};
  showed : boolean = false;
  
  constructor(public element : ElementRef, public router : Router,
    private alertCtrl : AlertController,
    private account : AccountService)
  { 
    this.selector = Object.create(null);
    this.selector.get = (ele:string) => {
        return this.element.nativeElement.querySelector(ele);
    };
    this.selector.all = (ele:string) => {
        return this.element.nativeElement.querySelectorAll(ele);
    };

    InfobarComponent.included = false;
  }

  ngOnInit()
  {
    this.reminder();
    InfobarComponent.included = false;
  }

  reminder()
  {

    this.router.events.subscribe((event:any)=>{
      if (event instanceof NavigationEnd)
      {
        const url = this.router.url;

        //  ensure we are not in verification page
        if (url != '/verification' && url != '/deposit-card' && url != '/deposit-voucher')
        {
            
        }
      }
  });
  }

  

  closeMenu()
  {
    const pan = this.selector.get('.menu-pan');
    const menu = this.selector.get('#footer');

    pan.classList.add('closeMenu');
    pan.classList.remove('showpan');

    const content = document.querySelectorAll('#content-section');

    setTimeout(()=>{
      pan.classList.remove('closeMenu');
    },550);

    setTimeout(()=>{
      menu.classList.remove('hidefooter');
      if (content.length > 0)
       {
          let last = content[content.length-1];
          last.setAttribute('style', 'filter:blur(0px);');
       }
    },300);
  }

  showMenu()
  {
    const pan = this.selector.get('.menu-pan');
    const menu = this.selector.get('#footer');

    const content = document.querySelectorAll('#content-section');

    menu.classList.add('hidefooter');

    setTimeout(()=>{
       pan.classList.add('showpan');
       if (content.length > 0)
       {
          let last = content[content.length-1];
          last.setAttribute('style', 'filter:blur(0px);');
       }
    },300);
  }

  goto(page : any)
  {
    this.closeMenu();
    setTimeout(()=>{
      this.router.navigateByData({
          url : [page],
          data : []
      });
    },700);
  }

}
