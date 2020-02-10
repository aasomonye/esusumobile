
class HTTP
{
	data : any = {};
	lastsize : any = {};
	size : any = {};
	header : any = {};
	callback : any;
	remove : any = [];

	connect()
	{
		this.callback = new Function();
		return new XMLHttpRequest();
	}

	get(p:any, callback:any = false, id:number = 0)
	{
		"use strict";

		var params = p;
		
		this.header = Object.assign(this.header, {
			'X-Request-Method' : 'GET'
		});

		this.post(params, null, callback, id);

		return this;
	}

	put(p:any, data:any, callback:any=false, id:number = 0)
	{
		"use strict";
		
		this.header = Object.assign(this.header, {
			'X-Request-Method' : 'PUT'
		});

		this.post(p, data, callback, id);

		return this;
	}

	post(p:string, post:any, callback:any = false, id:number = 0)
	{
		"use strict";

		var xhr = this.connect();
		xhr.withCredentials = false;
		var params = p;
		var data : any = [];
		data['data'] = null;

		if (typeof post == 'object' && post !== null)
		{
			var ffm = new FormData();
			for (let i in post)
			{
				ffm.append(i, post[i]);
			}
			post = ffm;
		}

		xhr.open("POST", params, true);

		if (this.remove.length > 0)
		{
			if (this.remove.indexOf('content-type') < 0)
			{
				xhr.setRequestHeader("content-type", "application/form-encoded");
			}
		}
		else
		{
			xhr.setRequestHeader("content-type", "application/form-encoded");
		}
		

		if (this.header != null)
		{
			for (var x in this.header)
			{
				xhr.setRequestHeader(x, this.header[x]);
			}

			this.header = {};
		}

		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 2 || xhr.readyState == 4)
			{
				if(xhr.readyState == 4)
				{	
					
					data['text'] = xhr.responseText;
					data['status'] = xhr.status;
					data['url'] = xhr.responseURL;

					var type = xhr.response.substring(0,1);

					if(type == "{" || xhr.response.substring(0,2) == '[{')
					{
						data['data'] = JSON.parse(xhr.response);
					}
					else
					{
						data['data'] = xhr.response;
					}

					let _data : any = data;
					let __data = {data : _data.data, text : _data.text, status : _data.status, url : _data.url};

					if(callback !== false)
					{
						callback.call(this, __data, id);	
					}

					this.callback.call(Object.create(null), __data, id);

					_data = null; __data = null;
				}
			}
		}.bind(this);

		xhr.send(post);


		if(callback == false)
		{
			var then = setInterval(function(){
				if(data.data != null)
				{
					clearInterval(then);
					this.data = data;
					data = null;
				}
			},100);
		}

		return this;
	}

	headers(data:any)
	{
		this.header = data;
	}

	then(callback:any)
	{
		this.callback = callback;
	}
}

export {HTTP};