import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';
import { loader } from 'src/lab/loader';
import { System } from 'src/lab/message';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.page.html',
  styleUrls: ['./agent.page.scss'],
})
export class AgentPage implements OnInit {

  isAgent : boolean = false;

  constructor(public location : Location,
    private user : UserService, public account : AccountService) { 

      this.manageAgent();
    }
  
  ionViewDidLoad()
  {
     this.manageAgent();
  }

  manageAgent()
  {
      const profile = this.account.data.profile.data;
      
      if (profile.AccountType == 1)
      {
         this.isAgent = true;
      }
  }

  ngOnInit() {
  }

  goback()
  {
    this.location.back();
  }

  agentRequest()
  {
     this.account.prepareToken(()=>{
        loader.show();
        const id = this.account.data.id;
        this.user.put('agent/request/'+id, {}).then((res:any)=>{
           loader.dismiss();
           var type = loader.status(res);

           if (type.error)
           {
              if (this.user.alive(res.data.message))
              {
                 System.error(res.data.message);
              }
           }
           else
           {
              System.success(res.data.message);
           }
        });
     });
  }

}
