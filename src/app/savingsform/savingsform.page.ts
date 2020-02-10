import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { System } from 'src/lab/message';
import { AccountService } from '../api/account.service';
import { UserService } from '../api/user.service';
import { loader } from 'src/lab/loader';

@Component({
  selector: 'app-savingsform',
  templateUrl: './savingsform.page.html',
  styleUrls: ['./savingsform.page.scss'],
})
export class SavingsformPage implements OnInit {

  plan : any;
  package : any = {};
  transfer : string = 'Yes';
  formpack : any = {};

  constructor(public router : Router,
   public account : AccountService,
    private user : UserService) {

      const data = this.router.getNavigatedData();

      if ('MinimumBalance' in data)
      {
         this.plan = data;
         this.formpack = Object.create(null);
      }
      else
      {
         this.router.navigateByData({url:['/addsavings'], data:[]});
      }
  }

  ngOnInit() {
  }

  ionViewDidEnter()
  {
      
  }

  create(id:any)
  {
     if (System.form())
     {
        this.account.prepareToken(()=>{
            loader.show({dismiss:false});
            const cid = this.account.data.id;
            this.formpack.ProductID = id;

            this.user.put('saving/add/'+cid, this.formpack).then((res:any)=>{
                loader.text('collecting feeds');
                const type = loader.status(res);

                if (type.error)
                {
                   loader.dismiss(1000);

                   System.error(res.data.message);
                }
                else
                {

                  this.account.accountInfo(()=>{
                     loader.dismiss(1000);
                     System.success(res.data.message, ()=>{
                        this.formpack = Object.create(null);
                        this.router.navigateByData({url:['/savings'], data : []});
                     });
                  });
                   
                }
            });
        });
     }
  }

  learnMore(plan:any){
    this.router.navigateByData({url : ['/aboutplan'], data : plan});
  }

}
