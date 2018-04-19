
//获取 url 中的参数
// 1. 指定参数名称，返回该参数的值 或者 空字符串
// 2. 不指定参数名称，返回全部的参数对象 或者 {}
// 3. 如果存在多个同名参数，则返回数组

function getUrlParam(sUrl, sKey) {
    var obj={};
    var index = sUrl.indexOf("?");
    if(index==-1){
        if(sKey==undefined){
            return obj;
        }
        else{
            return '';
        }
    }
    var queryString = sUrl.split('?')[1].split('#')[0];
    var query = queryString.split('&');
    for(var i = 0; i< query.length; i++){
        var keyValue = query[i].split('=');
        var key = keyValue[0];
        var value = keyValue[1];
        if(value==''){
            continue;
        }
        if(obj.hasOwnProperty(key)){
            if(Array.isArray(obj[key])){
                obj[key].push(value);
            }
            else{
                 var val = obj[key];
                obj[key] = [];
                obj[key].push(val);
                 obj[key].push(value);
            }
        }else{
            obj[key]=value;
        }
    }
    if(sKey){
        return obj[sKey]?obj[sKey]:"";
    }else{
        return obj;
    }
}