import { Injectable } from '@angular/core';
import { HTTP } from '../../assets/http/http';
import { System } from '../../lab/message';
import { loader } from '../../lab/loader';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  endpoint : string = 'http://esusuonline.com.ng:90/';
  apiToken  : string = '1fc5e01db757246af8dcf653d97bba6e';
  imagedir : string = 'public/assets/images/';
  expired : string = '/home';
  headers : any = {};
  callback : any = {};
  token : any = null;
  waitingList : any = [];
  waitingID = 0;
  remove : any = [];
  public static runningService : boolean = false;

  constructor(public router : Router) {
    // set request header
    this.callback = new Function();
  }

  headersRemove(key:string)
  {
    this.remove.push(key);
  }

  // get requests
  get(path:string)
  { 
    this.waitingID += 1;

    const ID = this.waitingID;

    let headers = {
      'X-Api-Token' : this.apiToken
    };

    if (this.token != null)
    {
      headers = Object.assign(headers, {
        'X-Api-Hash' : this.token
      });
    }

    const http = new HTTP;
    http.headers(headers);
    http.remove = this.remove;

    UserService.runningService = true;

     http.get(this.endpoint + path, (res:any, ID:number) => {
     
      if (res.status > 0)
      {
        if (this.waitingList.length > 0 && typeof this.waitingList[ID] != undefined)
        {
            const callback = this.waitingList[ID];
            if (typeof callback == 'function')
            {
              callback.call(Object.create(null), res);
            }
        }
        
      }
      else
      {
        loader.dismiss();
        System.error('No Network connection found. Please check your network settings',()=>{
          this.router.navigateByData({url : ['/home'], data : []});
        });
      }

      UserService.runningService = false;

     }, ID);

     return this;
  }

  // post request
  post(path:string, data:any)
  {
    let headers = {
      'X-Api-Token' : this.apiToken
    };

    this.waitingID += 1;

    const ID = this.waitingID;

    if (this.token != null)
    {
      headers = Object.assign(headers, {
        'X-Api-Hash' : this.token
      });
    }

    const http = new HTTP;
    http.headers(headers);
    http.remove = this.remove;

    UserService.runningService = true;

    http.post(this.endpoint + path, data, (res:any, ID:number) => {
      if (res.status > 0)
      {
        if (this.waitingList.length > 0 && typeof this.waitingList[ID] != undefined)
        {
            const callback = this.waitingList[ID];
            if (typeof callback == 'function')
            {
              callback.call(Object.create(null), res);
            }
        }
      }
      else
      {
        loader.dismiss();
        System.error('No Network connection found. Please check your network settings',()=>{
          this.router.navigateByData({url : ['/home'], data : []});
        });
      }

      UserService.runningService = false;
    }, ID);

    return this;
  }

  // post request
  put(path:string, data:any)
  {
    let headers = {
      'X-Api-Token' : this.apiToken
    };

    this.waitingID += 1;

    const ID = this.waitingID;

    if (this.token != null)
    {
      headers = Object.assign(headers, {
        'X-Api-Hash' : this.token
      });
    }

    const http = new HTTP;
    http.headers(headers);
    http.remove = this.remove;

    UserService.runningService = true;

    http.put(this.endpoint + path, data, (res:any, ID:number) => {
      if (res.status > 0)
      {
        if (this.waitingList.length > 0 && typeof this.waitingList[ID] != undefined)
        {
            const callback = this.waitingList[ID];
            if (typeof callback == 'function')
            {
              callback.call(Object.create(null), res);
            }
        }
      }
      else
      {
        loader.dismiss();
        System.error('No Network connection found. Please check your network settings', ()=>{
          this.router.navigateByData({url : ['/home'], data : []});
        });
      }
      UserService.runningService = false;
    }, ID);

    return this;
  }

  // then method
  then(callback:any)
  {
     this.waitingList[this.waitingID] = callback;
  }

  // open
  open(method:string, url:string, data:any=null)
  {
    let headers = {
      'X-Api-Token' : this.apiToken
    };

    if (this.token != null)
    {
      headers = Object.assign(headers, {
        'X-Api-Hash' : this.token
      });
    }

    const http = new HTTP;
    http.headers(headers);
    http.remove = this.remove;

    UserService.runningService = true;


  }

  alive(message:string)
  {
    return true;
  }
}
