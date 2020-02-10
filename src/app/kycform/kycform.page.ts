import { Component, OnInit } from '@angular/core';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kycform',
  templateUrl: './kycform.page.html',
  styleUrls: ['./kycform.page.scss'],
})
export class KycformPage implements OnInit {

  constructor(private user : UserService, public account : AccountService, private router : Router) { }

  ngOnInit() {
     this.change();
  }

  change()
  {
      let utilitybill : any, passport : any, identification : any;
      utilitybill = document.querySelector('#utilitybill');
      passport = document.querySelector('#passport');
      identification = document.querySelector('#identification');


      passport.addEventListener('change', ()=>{
         if (passport.files.length > 0)
         {
            passport.previousElementSibling.classList.add('selected-file');
            passport.previousElementSibling.firstElementChild.innerText = 'Passport selected';
         }
      });

      utilitybill.addEventListener('change', ()=>{
         if (utilitybill.files.length > 0)
         {
            utilitybill.previousElementSibling.classList.add('selected-file');
            utilitybill.previousElementSibling.firstElementChild.innerText = 'Utility Bill selected';
         }
      });

      identification.addEventListener('change', ()=>{
         if (identification.files.length > 0)
         {
            identification.previousElementSibling.classList.add('selected-file');
            identification.previousElementSibling.firstElementChild.innerText = 'Identification selected';
         }
      });
  }

  continue()
  {
     let utilitybill : any, passport : any, identification : any;
     utilitybill = document.querySelector('#utilitybill');
     passport = document.querySelector('#passport');
     identification = document.querySelector('#identification');

     if (utilitybill.files.length > 0 && passport.files.length > 0 && identification.files.length > 0)
     {
        let data = {};

        data['Passport'] = passport.files[0];
        data['UtilityBill'] = utilitybill.files[0];
        data['Identification'] = identification.files[0];

        loader.show();
        
         this.account.prepareToken(()=>{
            
            this.user.headersRemove('content-type');

            this.user.post('verify/kyc/'+this.account.data.id, data).then((res:any)=>{
                  let type = loader.status(res);
                  loader.dismiss();

                  if (type.error)
                  {
                     System.error(res.data.message);
                  }
                  else
                  {
                     System.success(res.data.message, ()=>{
                        this.router.navigateByData({url : ['/verification'], data : ['home']});
                     });
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
