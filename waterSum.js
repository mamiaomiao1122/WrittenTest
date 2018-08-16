/**
 *JavaScript语言实现
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    //数组的长度
    var n = height.length
    
    //雨水的总量
    var waterSum = 0
    
    //柱子的右边的最高的柱子的高度
    var rightMax = []
    
    //柱子的左边的最高的柱子的高度，初始值为0
    var leftMax = 0
    
    //中间变量
    var maxH = 0
    
    /**
    *结果是得到当前右边最大的柱子的数组rightMax
    *rightMax[j]当前柱子的右边的最高的柱子的高度
    */
    for(var j = n-1; j >= 0; j--){      
        maxH = (maxH > height[j] ? maxH : height[j]);
        rightMax[j] = maxH
    }
    
    /**
    *获得总的雨水量waterSum
    *leftMax[i]当前柱子的左边的最高的柱子的高度
    */
    for(var i = 0; i < n ; i++){
        //当前柱子的左边最大值和右边最大值中取得最小值
        var minH = (leftMax < rightMax[i] ? leftMax : rightMax[i])
        //如果最小值和当前柱子的高度相比较
        if(height[i] < minH){
            waterSum += minH - height[i] 
        }
        //将目前左边最高度和当前柱子的高度相比，这样可实现在下一轮比较中，获得左边最高的柱子高度
        leftMax =  (leftMax > height[i] ? leftMax : height[i])
    }  
    return waterSum;
};