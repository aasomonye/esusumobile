import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../api/account.service';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-aboutplan',
  templateUrl: './aboutplan.page.html',
  styleUrls: ['./aboutplan.page.scss'],
})
export class AboutplanPage implements OnInit {
  plan : any = {};
  formpack : any = {};

  constructor(public location : Location, public router : Router,
    public account : AccountService,
    private user : UserService) {
    this.plan = this.router.getNavigatedData();
    this.formpack.Amount = Number(this.plan.MinimumBalance);
    this.formpack.transfer = true;
  }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  continue()
  {
    
      this.account.prepareToken(()=>{
          loader.show({dismiss:false});
          const cid = this.account.data.id;
          this.formpack.ProductID = this.plan.ID;

          this.user.put('saving/add/'+cid, this.formpack).then((res:any)=>{
              loader.text('collecting feeds');
              const type = loader.status(res);

              if (type.error)
              {
                loader.dismiss(1000);

                if (this.user.alive(res.data.message))
                {
                    System.error(res.data.message);
                }
              }
              else
              {
                
                this.account.loadall(()=>{
                  loader.dismiss(1000);
                  System.success(res.data.message).close(()=>{
                      this.router.navigateByData({url:['/savings'], data : []});
                  });
                });
              }
          });
      });
    
  }

}
