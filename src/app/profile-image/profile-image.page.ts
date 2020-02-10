import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../api/user.service';
import { AccountService } from '../api/account.service';
import { System } from 'src/lab/message';
import { loader } from 'src/lab/loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.page.html',
  styleUrls: ['./profile-image.page.scss'],
})
export class ProfileImagePage implements OnInit {
  _continue : boolean = false;

  constructor(private location : Location,
              private user : UserService,
              public account : AccountService,
              private router : Router) { }

  ngOnInit() {
    this.watch();
  }

  watch()
  {
      const image : any = document.querySelector('#image');
      const wrap : any = document.querySelector('.profile-image2');
      const imagePicker : any = document.querySelector('*[for="image"]');

      image.addEventListener('change', ()=>{
         const file = image.files[0];
         const type = file.type;

         if (type.match(/^(image)/))
         {
            this._continue = true;
            var filereader = new FileReader();
            filereader.onload = function(e:any){
               var img : any = wrap.firstElementChild;
               img.src = e.target.result;
            };
            filereader.readAsDataURL(file);
            wrap.style.display = 'flex';
            imagePicker.firstElementChild.innerText = 'Change Image';
         }
         else
         {
            this._continue = false;
            imagePicker.firstElementChild.innerText = 'Pick an Image';
            System.error('Invalid image format. Please select a valid image.');
         }
      });
  }

  continue()
  {
    if (this._continue === true)
    {
        const image : any = document.querySelector('#image');
        loader.text('please wait');
        loader.show({dismiss:false});

        this.account.prepareToken(()=>{
            const id = this.account.data.id;
            this.user.headersRemove('content-type');

            this.user.post('customer/profile/'+id, {
              profile : image.files[0]
            }).then((e:any)=>{
              
              const type : any = loader.status(e);
              if (type.error)
              {
                  loader.dismiss();
                  System.error(e.data.message);
              }
              else
              {
                  this.account.data.profileimage = this.user.endpoint + this.user.imagedir + image.files[0].name;
                  loader.text('profile updated');
                  loader.dismiss(1000, ()=>{
                      this.router.navigateByData({url : ['/profile'], data : []});
                  }); 
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
