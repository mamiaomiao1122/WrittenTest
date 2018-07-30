$(document).ready(function(){
	
	// show();
	initMaze(3,3)
	printMaze("0,1 0,2");

})



function initMaze( m,  n) {
        var m = 2 * m + 1
        var n = 2 * n + 1
        var arr;
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
            	 arr[i][j] = "[W]";
                 document.write(arr[i][j]+" &nbsp &nbsp");
                    console.log("w")
                    new ActiveXObject("Scripting.FileSystemObject"); 
                
            }
            document.write("<br><br>")
        }
        
    }
function printMaze(str){
	var arr = str.split(" ");
	var first = arr[0];
	var second = arr[1];
	var after_first = convert2pot(first);
	var after_secong = convert2pot(second);


	// if

}
function convert2pot(i){
	return 2*i+1;
}

function node(x,y){
	 /**
     * 坐标X
     **/
    this.x = x;

    /**
     * 坐标Y
     **/
    this.y = y;
}

node.prototype = {
	getX:function(){
		return x;
	},
	getY:function(){
		return y;
	},
	pot:function(x,y){
		this.x = x;
		this.y = y;
	}
}

	var road_size_string = $("#road_size").val();
	var row_col = road_size_string.split("*")
	var road_row = parseInt(row_col[0])
	var road_col = parseInt(row_col[1])

	var render_row = road_row*2+1;
	var render_col = road_col*2+1;

	var render_rules = $("#road_connect").val()

	var rules = render_rules.split(";")

	

function show(){

	// for(var i=0;i<render_row;i++){
	// 	for(var j=0;j<render_col;j++){

	// 	}
	// }
	
	var html = '<div style="width:20px;height:20px;margin:5px;">';
	for(var i=0; i<render_row; i++){
		html += '<div style="display:inline-flex;">';
		for(var j=0; j<render_col; j++){
			html += "<div style='width:20px;height:20px;margin:5px;background-color: pink;display:inline'></div>";
		}
		html += '</div>';
	}
	html+='</div>';


	$("#result").append(html);

	for(var i=0;i<rules.length;i++){
		var every_rule = rules[i].split(" ")
		// if(every_rule[0] every_rule[1])

	}

}



function creatWallBlock(){
	var div1=document.createElement("div");  
	div1.id ="smallWall"; 	
	$("#result").append(div1);
}

function creatRoadBlock(){
	var div1=document.createElement("div");  
	div1.id ="smallRoad"; 	
	$("#result").append(div1);
}