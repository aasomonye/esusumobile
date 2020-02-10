import { Component, OnInit } from '@angular/core';
import { AccountService } from '../api/account.service';
import { Location } from '@angular/common';
import { UserService } from '../api/user.service';
import { Router } from '@angular/router';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';

@Component({
  selector: 'app-quicksave',
  templateUrl: './quicksave.page.html',
  styleUrls: ['./quicksave.page.scss'],
})
export class QuicksavePage implements OnInit {

  formpack : any = {};
  plan : any = {};
  PIN : string = '';

  constructor(public account : AccountService, private location : Location,
    public user : UserService, public router : Router) {
       const plan = this.router.getNavigatedData();
       this.formpack.savingsPlanID = plan.ID;
       this.formpack.Amount = '';
       this.formpack.Description = 'Quick Save.';
       this.PIN = '';
       this.plan = plan;
  }

  ngOnInit() {
  }

  goback()
  {
     this.location.back();
  }

  save()
  {
     if (this.PIN != '' && this.formpack.Amount != '')
     {
        loader.show({dismiss:false});
        loader.text("Please wait..");

        this.account.prepareToken(()=>{
            const id = this.account.data.id;

            this.user.post('verifyPin', {PIN:this.PIN}).then((res:any)=>{
                const status = res.data.status;
                
                if (typeof status != undefined && status == 'Success')
                {
                  this.user.put('saving/fund/'+id, this.formpack).then((res:any)=>{
                    const type = loader.status(res);
      
                    if (type.error)
                    {
                      loader.dismiss();
                      System.error(res.data.message);
                    }
                    else
                    {
                      this.account.accountInfo(()=>{
                        loader.dismiss();
                        this.formpack = {};
                        this.PIN = '';
                        System.success(res.data.message, ()=>{

                        });
                      });
                    }
                  });
                }
                else
                {
                  loader.dismiss();

                   System.error('Invalid PIN');
                }
            });
            
        }); 
     }
     else
     {
        System.error('All fields are required.');
     }
  }

}
