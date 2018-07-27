(function(){
	// 序列化表单
	var serialize = function(form){
		var array = new Array(),field = null,elements = form.elements,
			formElements = ["input","select","textarea"],
			elementField = null,
			elementArray = null;
		if(form.nodeName.toLowerCase() != "form"){			
			elements = [];
			for(var i = 0,len = formElements.length; i < len; i++){
				elementField = formElements[i];
				elementArray = form.querySelectorAll(elementField);
				for(var j =0 ,size = elementArray.length; j < size ;j++){
					elements.push(elementArray[j]);
				}
			}
		}		
		for(var i =0,len = elements.length;i < len; i++){
			field = elements[i];			
			switch(field.type){
				case "select-one":
				case "select-multiple":
					for(var j=0,opLen = field.options.length;j<opLen;j++){
						var option = field.options[j];
						if(option.selected){
							var optValue = "";
							if(option.hasAttribute){
								optValue = (option.hasAttribute("value") ? option.value : option.text);
							}else{
								optValue = (option.attributes["value"].specified ? option.value : option.text);
							}
							array.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));	
						}
					}
				case undefined : 
				case "file":
				case "submit":
				case "reset":
				case "button":
					break;
				case "radio":
				case "checkbox":
					if(!field.checked){
						break;
					}
				default:
					array.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));			
			}			
		}
		return array.join("&");
	}
	// 浏览器信息
	var browser  = function(){
		var userAgent = navigator.userAgent
		return {
			isWeixin : /MicroMessenger/ig.test(userAgent), 
			isAndroid : /android/ig.test(userAgent),
			isIos : /iphone|ipod|ipad/ig.test(userAgent),  
			isQQ : /QQ/ig.test(userAgent), 	
			isApp : /umpay/.test(userAgent),			
			isWebkit : /AppleWebKit/.test(userAgent),
			isFirefox:/Firefox/.test(userAgent)
		}
	};
	// 添加数据
	var setValue = function(key,value){
		var obj = document.querySelectorAll("[name='"+key+"']"),field=null;
		// 循环设置
		for(var i = 0,len = obj.length;i < len; i++){
			field = obj[i];			
			switch(field.type){
				case "select":
					for(var j=0,opLen = field.options.length;j<opLen;j++){
						var option = field.options[j];
						if (option.value == value) { 
							option.selected = true; 							
							break; 
						} 
					}
					break;
				case "radio":	
					if(field.value == value){
						field.checked = true;
					}
					break;					
				case "checkbox":
					var reg = new RegExp(field.value+"\\b");
					if(reg.test(value)){
						field.checked = true;
					}
					break;	
				default:
					field.value = value;
			}
		}
	}
	// 读取全局变量参数
	var TEMP_DATA = window.Common.TEMP_DATA, // 用户模板
		DATA = window.Common.DATA, // 用户数据
		formLabel = window.Common.formLabel,// 表单
		submitBtn = window.Common.submitBtn,// 提交按钮
		formLabelArray = null,// 分割表单数组
		submitBtnArray = null, //分割表单数组
		size = 0; // size

	// 读取参数并设置值
	for(key in TEMP_DATA){
		setValue(key,DATA[TEMP_DATA[key]]);		
	}

	// 分割数据 逗号分割
	formLabelArray = formLabel.split(",");
	submitBtnArray = submitBtn.split(",");
	size = Math.max(formLabelArray.length,submitBtnArray.length);
	// 判断大小
	forEachObj(formLabelArray,submitBtnArray,size);


	// 循环绑定事件
	function forEachObj(formLabelArray,submitBtnArray,size){
		for(var i = 0;i< size;i++){
			var btn = document.querySelector(submitBtnArray[i] || submitBtnArray[0]),
				label = formLabelArray[i]||formLabelArray[0];
			if(btn){
				(function(label){
					btn.addEventListener("click",function(event,babel){
						listener(event,label);
					},true);
				})(label);				
			}
		}
	}
	// 监听事件
	function listener(e,selector){
		var client = browser(),obj = document.querySelector(selector),data = null;
		if(!obj){
			return false;	
		}
		data = serialize(obj);
		try{
			window.postMessage(data);
		}catch(e){
			
		}
	}	
})();