import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';
import { Location } from '@angular/common';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';

@Component({
  selector: 'app-agent-liquidate',
  templateUrl: './agent-liquidate.page.html',
  styleUrls: ['./agent-liquidate.page.scss'],
})
export class AgentLiquidatePage implements OnInit {

  formpack : any = {};

  constructor(
    private user : UserService,
    public account : AccountService,
    private location : Location
  ) {
    this.formpack = Object.create(null);
  }

  ngOnInit() {
  }

  continue()
  {
     if (System.form())
     {
        this.account.prepareToken(()=>{
          const id = this.account.data.id;
          
          loader.show({dismiss:false});

          this.user.put('agent/liquidate/'+id, this.formpack).then((res:any)=>{
              loader.dismiss();
              const type = loader.status(res);

              if (type.error)
              {
                System.error(res.data.message);
              }
              else
              {
                 for (const i in this.formpack)
                 {
                   this.formpack[i] = '';
                 }

                 System.success(res.data.message);
              }
          });
        });
     }
  }

  goback()
  {
     this.location.back();
  }

}
