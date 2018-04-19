// 统计字符串中每个字符的出现频率，返回一个 Object，key 为统计字符，value 为出现频率
// 1. 不限制 key 的顺序
// 2. 输入的字符串参数不会为空
// 3. 忽略空白字符


//输入：'hello world'
//输出：{h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1}

function count(str) {
    var obj={};
    var str1= str.match(/\S/g);
    for(var i in str1){
        if(obj[str1[i]]){
            obj[str1[i]]++
        }
        else{
            obj[str1[i]] = 1
        }
    }
    return obj;
}

function count(str) {
    for(var i=0, m=str.length, res={}; i<m; i++){
        if(str.charAt(i) in res) res[str.charAt(i)]++;
        else res[str.charAt(i)] = 1;
    }
    return res;
}

function count(str) {
    var obj={};
    str=str.replace(/\s/,'');
    for(var i=0,length=str.length;i<length;i++){
        if(obj.hasOwnProperty(str[i])){
            obj[str[i]]++;
        }else{
            obj[str[i]]=1;
        }
    }
    return obj;
}