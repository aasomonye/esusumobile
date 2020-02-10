class Message
{
    wrapper : any;
    wrapperInner : any;
    buttonClose : any;
    wrapperText : any;
    wrapperTitle : any;
    callback : any = null;
    events : any = {};

    constructor()
    {
        this.wrapper = document.querySelector('.notification');
        this.wrapperInner = this.wrapper.querySelector('.notification-inner');
        this.buttonClose = this.wrapper.querySelector('.button-close');
        this.wrapperText = this.wrapper.querySelector('.notification-text > p');
        this.wrapperTitle = this.wrapper.querySelector('.title');
    }

    show(type:string, text:string)
    {
        this.wrapper.classList.add(type);

        setTimeout(()=>{
            this.wrapper.style.display = 'flex';
            setTimeout(()=>{
                this.wrapper.style.opacity = 1;
                this.wrapperInner.style.transform = 'scale(1)';
                this.buttonClose.addEventListener('click', ()=>{
                    this.dismiss();
                    this.triggerEvent(text);
                    //this.events = Object.create(null);
                });
            },50);
        },100);
    }

    error(text:string, callback:any=null, button:string = 'Okay')
    {
        this.wrapperTitle.innerText = 'Opps !';
        this.wrapperText.innerHTML = text;
        this.buttonClose.firstElementChild.innerText = button;

        if (callback !== null)
        {
            this.events[text] = callback;
        }
        
        this.show('error', text);

        return this;
    }

    triggerEvent(text:string)
    {
        if (text in this.events)
        {
            let callback = this.events[text];
            if (callback !== null)
            {
                callback.call();
                //set to null
                this.events[text] = null;
            }
        }
    }

    success(text:string, callback:any=null, button:string = 'Okay')
    {
        this.wrapperTitle.innerText = 'Success !';
        this.wrapperText.innerHTML = text;
        this.buttonClose.firstElementChild.innerText = button;

        if (callback !== null)
        {
            this.events[text] = callback;
        }
        
        this.show('success', text);

        return this;
    }

    dismiss()
    {
        
        this.wrapperInner.style.transform = 'scale(1)';
        this.wrapper.style.opacity = 0;

        setTimeout(()=>{
            this.wrapper.style.display = 'none';
            this.wrapper.className = 'notification';
            if (this.callback !== null)
            {
                //this.callback.call(Object.create(null));
            }
        },400)
    }

    close(callback:any)
    {
        //this.callback = callback;
    }

    __error(clas:any, error = '')
   {
      let ele : any = document.querySelector('.'+clas+' > input');
      ele.classList.add('shakeform');
      
      setTimeout(()=>{
        ele.classList.remove('shakeform');
        ele.focus();
      },600);
   }

   form(target = '.intro-form', except : any = [])
   {
        let contin = true;

        var par1 : any = document.querySelectorAll(target);
        
        if (par1.length > 0)
        {
            let par = par1[par1.length-1];
            par1 = par;
        }
        else
        {
            par1 = null
        }

        if (par1 != null)
        {
            let tar = par1.querySelectorAll('input');

            [].forEach.call(tar, (e:any,i:number)=>{
                
                if (e.hasAttribute('name'))
                {
                    if (e.value == "" && except.indexOf(e.name) < 0)
                    {
                        contin = false;

                        setTimeout(()=>{

                            e.classList.add('shakeform');
      
                            setTimeout(()=>{
                                e.classList.remove('shakeform');

                                if (i == 0)
                                {
                                    e.focus();
                                }
                                
                            },600);

                        },(i * 500));
                    }
                }
                else
                {
                    if (e.value == "")
                    {
                        contin = false;

                        setTimeout(()=>{
                            e.classList.add('shakeform');
      
                            setTimeout(()=>{
                                e.classList.remove('shakeform');
                                
                                if (i == 0)
                                {
                                    e.focus();
                                }
                                
                            },600);

                        },(i * 500));
                    }
                }
            });
        }
        else
        {
            contin = false;
        }

        return contin;
   }


   clear(target = '.intro-form', except : any = [])
   {
        var par1 : any = document.querySelectorAll(target);
        
        if (par1.length > 0)
        {
            let par = par1[par1.length-1];
            par1 = par;
        }
        else
        {
            par1 = null
        }

        if (par1 != null)
        {
            let tar = par1.querySelectorAll('input');

            [].forEach.call(tar, (e:any,i:number)=>{
                
                if (e.hasAttribute('name'))
                {
                    if (e.value != "" && except.indexOf(e.name) < 0)
                    {
                        e.value = "";
                    }
                }
                else
                {
                    if (e.value != "")
                    {
                        e.value = "";
                    }
                }
            });
        }
   }
}

let System = new Message();

export {System};