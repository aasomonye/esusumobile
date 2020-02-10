import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-infobar',
  templateUrl: './infobar.component.html',
  styleUrls: ['./infobar.component.scss'],
})
export class InfobarComponent implements OnInit {

  selector : any = {};
  @Input() page : string;
  public static included : boolean = true;
  
  constructor(public element : ElementRef, public router : Router) { 
    this.selector = Object.create(null);
    this.selector.get = (ele:string) => {
        return this.element.nativeElement.querySelector(ele);
    };
    this.selector.all = (ele:string) => {
        return this.element.nativeElement.querySelectorAll(ele);
    };

    InfobarComponent.included = true;
  }

  ngOnInit()
  {
    InfobarComponent.included = true; 
  }

  ngAfterViewInit()
  {

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
