
//为 Array 对象添加一个去除重复项的方法

Array.prototype.uniq = function () {
    var result = [];
    var flag = true;
    for(var i =0;i<this.length;i++)
        {
            if(result.indexOf(this[i])==-1)
                {
                    if(this[i]!=this[i])  //排除NaN
                        {
                            if(flag)
                                {
                                    result.push(this[i]);
                                    flag = false;
                                }
                        }
                    else
                        {
                            result.push(this[i]);
                        }
                }
        }
    return result;
}