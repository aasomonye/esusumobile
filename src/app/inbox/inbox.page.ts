import { Component, OnInit } from '@angular/core';
import { AccountService } from '../api/account.service';
import { Location } from '@angular/common';
import { loader } from 'src/lab/loader';
import { UserService } from '../api/user.service';
import { System } from 'src/lab/message';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {

  ticketType : string = '';
  ticketTitle : string = '';
  message : string = '';

  constructor(
    public account : AccountService,
    private location : Location,
    private user : UserService
  ) { }

  ngOnInit() {
  }

  send()
  {
     if (this.message != '' && this.ticketType != '' && this.ticketTitle != '')
     {
        loader.show({dismiss:false});
        loader.text('Sending Ticket');

        this.account.prepareToken((id:any)=>{
            this.user.post('sendticket/'+id, {
              type : this.ticketType,
              title : this.ticketTitle,
              message : this.message
            }).then((res:any)=>{
              const type = loader.status(res);

              if (type.error)
              {
                loader.dismiss();

                  if (this.user.alive(res.data.message))
                  {
                      System.error(res.data.message);
                  }
              }
              else
              { 
                  this.ticketTitle = '';
                  this.ticketType = '';
                  this.message = '';
                  
                  loader.dismiss();
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
