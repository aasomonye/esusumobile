
class Loader 
{
    apploader : any = {};
    dismissBtn : any = {};
    afterCallback : any = [];
    dismissCounter : number = 0;
    
    load()
    {
        this.apploader = document.querySelector('.app-loader');
        this.dismissBtn = this.apploader.querySelector('.dismiss');
    }

    text(text:string)
    {
        this.load();
        this.dismissBtn.style.opacity = 0;
        setTimeout(()=>{
            this.dismissBtn.style.display = 'block';
            setTimeout(()=>{
                this.dismissBtn.setAttribute('data-listen', false);
                this.dismissBtn.innerText = text;
                this.dismissBtn.style.opacity = '0.8';
            },100);
        },400);
    }

    show(config:any = {})
    {
        this.load();

        this.dismissBtn.style.display = 'block';

        this.apploader.style.display = 'flex';

        setTimeout(()=>{
            this.apploader.style.opacity = 1;
        },50);

        if ('dismiss' in config)
        {
            if (config.dismiss === false)
            {
                this.dismissBtn.style.display = 'none';
            }
        }
        
        if (this.dismissBtn != null)
        {
            this.dismissBtn.addEventListener('click', ()=>{
                if (!this.dismissBtn.hasAttribute('data-listen'))
                {
                    this.dismiss();
                }
            });
        }
    }

    after(callback:any)
    {
        this.afterCallback.push(callback);
    }

    dismiss(delay :number = 0, callback : any = null)
    {
        setTimeout(()=>{

            this.load();
            this.apploader.style.opacity = 0;

            setTimeout(()=>{

                this.dismissCounter++;
                this.apploader.style.display = 'none';
                this.dismissBtn.innerText = 'dismiss';
                this.dismissBtn.style.opacity = '0.8';
                this.dismissBtn.style.display = 'block';
                this.dismissBtn.removeAttribute('data-listen');

                if (this.afterCallback.length > 0 && typeof this.afterCallback[this.dismissCounter-1] != 'undefined')
                {
                    this.afterCallback[this.dismissCounter-1].call(Object.create(null));
                }

                if (typeof callback == 'function')
                {
                    callback.call(Object.create(null));
                }
            },800);

        },delay);

        return this;
    }

    status(res:any={})
    {
        let Response = {error : false, success : false, failed : false};

        if (typeof res == 'object' && 'data' in res)
        {
            if (res.data.status == 'Error' || res.data.status == 'error' || res.data.status == 'failed')
            {
                Response.error = true;
            }

            if (res.data.status == 'Success' || res.data.status == 'success')
            {
                Response.success = true;
            }
        }

        return Response;
    }
}

const loader = new Loader();

export {loader};