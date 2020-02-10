import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {

  constructor(public location : Location) { }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

}
