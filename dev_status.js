/*
 * 描述: 可翻页的列表面板使用示例
 *
 * 作者: WangLin，245105947@qq.com
 * 公司: capsheaf
 * 历史：
 *	   2014.08.01 WangLin创建
 */

/*
 * 注释<1>：此文档的“配置对象”指new PagingHolder时传入的对象
 */
  
var face_unit = 'B';
var dev = null;
try {
	dev = JSON.parse(localStorage.getItem('dev'));
} catch (err) {};
$(document).ready(function() {
	interface_panel.render();
	safeEvent_panel.render();
	list_panel.render();
	real_time_chart = echarts.init(document.getElementById('real_time_fresh'));
	real_time_chart.setOption(echart_option);
	real_time_chart.showLoading({
		text:"加载中",
		effect:"whirling",
		textStyle : {
			fontSize : 20
		}
	})
	setTimeout(function() {
		change_width();
		window.onresize = function() {
			change_width();
		}
	}, 200);
	change_width();
	(function() {

		if (dev === null) {
			localStorage.setItem('dev', JSON.stringify(fsArr_default));
			dev = fsArr_default;
		}
		$("#cpu_bar,#disk_bar,#memory_bar").progressbar({
			value: 0
		})
		$("#cpu_value,#disk_value,#memory_value").text("0%");
		$.each(queueManager, function(i, v) {
			v['fn']();
		})

		var domArr = $(".config_panel").children();
		validateLocalStorage(dev);
		$.each(domArr, function(i, v) {
			var _id = $(v).attr("id");
			// console.log('init:',i,v)
			if (_id == 'throughput_config') {
				$(v).find("input[name='clock'][value='" + dev[_id]['clock'] + "']").prop('checked', true);
				$(v).find("input[name='unit'][value='" + dev[_id]['unit'] + "']").prop('checked', true);
				echart_option.yAxis.name = dev[_id]['unit'] + "/s";
			} else if (_id == 'interface_config') {
				face_unit = dev[_id]['face_unit'];
				if (face_unit != 'b' && face_unit != 'B') {
					face_unit = 'B';
				};
				$(v).find("input[name='face_unit'][value='" + dev[_id]['face_unit'] + "']").prop('checked', true);
			}
			$(v).find("input[name='interval']").val(dev[_id]['interval']);

			$(v).find("input[name='isAutoFresh']").prop("checked", dev[_id]['isAutoFresh']);
		})
		real_time_chart.hideLoading();
		real_time_chart.setOption(echart_option);

		initOption();
	})()



	var timeTicket = setTimeout(function publicFn() {
		count++;

		if (dev === null) { //防止人为删除localStorage
			localStorage.setItem('dev', JSON.stringify(fsArr_default));
			dev = fsArr_default;
		}
		//验证localStorage的合法性
		validateLocalStorage(dev);
		var keys = Object.keys(dev);
		for (var i = 0, k; k = keys[i++];) {
			(function(key, value) {
				if (value['isAutoFresh'] == true && count % value['interval'] == 0) {
					queueManager[key]['fn']();
				}

			})(k, dev[k]);
		}
		setTimeout(publicFn, 1000);

	}, 1000);
	  
});
window.onload=function(){  
     $(".module").Tdrag({
			scope:".module-content23",
			moveClass:"tezml", 
			handle:".title-box",
			pos:true,
			dragChange:true});
}
var fsDef = 5;
var count = 0;
var nameArr = ['KB/s', 'MB/s'];
var queueManager = {
	'sys_config': {
		'isAutoFresh': true,
		'interval': fsDef,
		'fn': refreshSys
	},
	'interface_config': {
		'isAutoFresh': true,
		'interval': fsDef,
		'fn': refreshInterface,
		'face_unit': 'B'
	},
	'safeEvent_config': {
		'isAutoFresh': true,
		'interval': fsDef,
		'fn': refreshSafeEvent
	},
	'throughput_config': {
		'isAutoFresh': true,
		'interval': fsDef,
		'fn': refreshChart,
		'clock': 'M',
		'unit': 'b',
		'zone': 'GREEN'
	}
};
var fsArr_default = {
	'sys_config': {
		'isAutoFresh': true,
		'interval': fsDef,

	},
	'interface_config': {
		'isAutoFresh': true,
		'interval': fsDef,
		'face_unit': 'B'

	},
	'safeEvent_config': {
		'isAutoFresh': true,
		'interval': fsDef,

	},
	'throughput_config': {
		'isAutoFresh': true,
		'interval': fsDef,
		'clock': 'H',
		'unit': 'B',
		'zone': 'GREEN'
	}
};

var SCALE_INT = {
	'': 1,
	'K': 1000,
	'M': 1000 * 1000,
	'G': 1000 * 1000 * 1000,
	'T': 1000 * 1000 * 1000 * 1000
};

var SCALE_INT1024 = {
	'': 1,
	'K': 1024,
	'M': 1024 * 1024,
	'G': 1024 * 1024 * 1024,
	'T': 1024 * 1024 * 1024 * 1024
};

function PreferSpeed(value, ps, fixed, extStr) {
	var _value = parseFloat(value);
	// var _value = dev.throughput_config.unit=='b' ? parseFloat(value)*8:parseFloat(value);
	var lst = ['T', 'G', 'M', 'K', ''];
	var delta = 0;
	if (fixed === undefined) fixed = 0;
	if (extStr === undefined) extStr = '';
	else {
		delta = 1 / (fixed * 100);
	}
	var tmpStr;
	for (var i = 0; i < lst.length; i++) {
		var unit = lst[i];
		if (_value > SCALE_INT[unit]) {
			return String((_value / SCALE_INT[unit] + delta).toFixed(fixed)).replace(/\.0*$/, '') + unit + ps + extStr;
		}
	}
	return value + ps + extStr;
}

function PreferSpeed1024(value, ps, fixed, extStr) {
	var _value = parseFloat(value);
	var lst = ['T', 'G', 'M', 'K', ''];
	var delta = 0;
	if (fixed === undefined) fixed = 0;
	if (extStr === undefined) extStr = '';
	else {
		delta = 1 / (fixed * 100);
	}
	for (var i = 0; i < lst.length; i++) {
		var unit = lst[i];
		if (_value > SCALE_INT1024[unit]) {
			return String((_value / SCALE_INT1024[unit] + delta).toFixed(fixed)).replace(/\.?0*$/, '') + unit + ps + extStr;
		}
	}
	return value + ps + extStr;
}

var unitFlag = "";
// var queueManager = (localStorage.getItem('dev') === null) ? queueManager_default :  JSON.parse(localStorage.getItem('dev'));
var data = [];
var real_time_chart;
var echart_option = {
	animation: false,
	color: ['rgb(5,141,199)', 'rgb(80,180,50)'],
	shadowColor: 'rgba(0, 0, 0, 0.5)',
	shadowBlur: 10,
	legend: {
		bottom: '2%',
		left: '10%',
		itemWidth: 17,
		itemHeight: 13,
		data: [{
			name: '下行',
			icon: 'rect',

		}, {
			name: '上行',
			icon: 'rect'
		}]
	},
	// grid:{
	//	 show:true
	// },
	tooltip: {
		trigger: 'axis',
		formatter: function(params) {
			var asv = '';
			var str = '';
			// console.log(params);
			if (params.length && !!params[0].axisValue) {
				asv = params[0].axisValue + '<br/>';
			}

			for (var i = 0; i < params.length; i++) {
				str += '<span class="square" style="background-color:' + params[i].color + '"></span>&nbsp' + params[i].seriesName + " : " + PreferSpeed1024(params[i].data, unitFlag, 2, '/s') + "<br/>";
			}
			return asv + str;
		},
		axisPointer: {
			animation: false
		}
	},
	xAxis: [{
		data: data,
		interval: 0,
		// type: 'time',
		splitLine: {
			show: true
		},

	}],
	yAxis: {
		type: 'value',
		boundaryGap: [0, '100%'],
		splitLine: {
			show: true
		},
		splitNumber: 4,
		axisLabel: {
			formatter: function(value) {
				return PreferSpeed(value, '');
			}
		}

	},
	series: [{
		name: '下行',
		type: 'line',
		smooth: true,
		showSymbol: false,
		hoverAnimation: false,
		data: data
	}, {
		name: '上行',
		type: 'line',
		showSymbol: false,
		smooth: true,
		hoverAnimation: false,
		data: data
	}]
};
var list_panel_render = {
	// 'checkbox': {
	//	 listeners: {	/* ===可选===，向checkbox增加类似click的外接监听 */
	//		 click: function( element, data_item, list_obj ) {
	//			 if ( element.checked ) {
	//				 alert( data_item.id + "chcked!" );
	//			 } else {
	//				 alert( data_item.id + "unchcked!" );
	//			 }
	//		 }
	//	 }
	// },
	// 'radio': {	  /* ===可选===，向radio增加类似click的外接监听 */
	//	 listeners: {
	//		 click: function( element, data_item, event, list_obj ) {
	//			 if ( element.checked ) {
	//				 alert( data_item.id + "chcked!" );
	//			 } else {
	//				 alert( data_item.id + "unchcked!" );
	//			 }
	//		 }
	//	 }
	// },
	// // 'name': {
	// //	 render: function( default_rendered_text, data_item ) {
	// //		 return '<span class="note">' + default_rendered_text + "--" + data_item.id + '</span>';
	// //	 }
	// // },
	// 'name':{
	//		 render:function(default_data,data_item){
	//			 console.log(default_data);
	//			 if(default_data == 1){
	//				 return '<span class="net_image">rtre</span>'
	//			 }else{
	//				 return '<span class="dis_net_image">rtgre</span>'
	//			 }
	//		 }
	//	 },
	// 'action': {
	//	 render: function( default_rendered_text, data_item ) {
	//		 return default_rendered_text;
	//		 var action_buttons = [{
	//			 enable: true,
	//			 id: "delete_all_logs",
	//			 name: "delete_all_logs",
	//			 cls: "",
	//			 button_icon: "search16x16.png",
	//			 button_text: "查看详情",
	//			 value: data_item.id,
	//			 functions: {
	//				 onclick: "alert(this.value);"
	//			 }
	//		 }];

	//		 return PagingHolder.create_action_buttons( action_buttons );
	//	 }
	// }
};

var ass_url = "/cgi-bin/d_status.cgi";
var list_panel_config = {
	url: ass_url,
	/* ***必填***，控制数据在哪里加载数据 */
	check_in_id: "list_panel",
	/* ***必填***，确定面板挂载在哪里 */
	panel_name: "listPanel",
	/* ==*可选*==，默认名字my_list_panel，当一个页面存在多个列表面板，此字段必填，
												以区别不同面板 */
	page_size: 9,
	/* ===可选===，控制数据项默认加载多少条，默认是15，此处可以在加载数据过程中更改，
									 更改方法是从服务器加载数据到浏览器时，传一个page_size字段到浏览器 */
	/*panel_title: "列表面板",		 ===可选===，面板的标题 */
	tr_class: {
		even_class: 'tr-class',
		odd_class: 'tr-class'
	},
	is_panel_closable: false,
	/* ===可选===，默认是false，控制面板是否可关闭 */
	is_modal: false,
	/* ===可选===，默认是false，控制面板是否模态显示 */
	modal_config: { /* ===可选===，当想控制模块框大小层次时创建，并且在is_modal为true时才生效 */
		modal_box_size: "l",
		/* ===可选===，默认是l，有l、m、s三种尺寸的模态框 */
		modal_level: 10,
		/* ===可选===，默认是10，数字越大，模态框弹得越上层，可以在其他模态框之上 */
		modal_box_position: "fixed" /* ===可选===，position属性值，目前未使用，未调试成功，建议不使用此字段 */
	},
	is_default_search: false,
	/* ===可选===，默认是true，控制搜索框是否展示，
												注意：这里的搜索条件会在用户每次加载数据前提交到服务器，搜索的实现，
											要在服务端根据提交上来的条件自行实现，这里并不会提供默认的搜索功能
								 */
	default_search_config: { /* ===可选===，只有当is_default_search为true时才生效 */
		input_tip: "输入某字段关键字以查询...",
		/* ===可选===，控制搜索输入框内的提示，默认是“输入关键字以查询...” */
		title: "某字段关键字" /* ===可选===，控制搜索输入框左边的提示，默认无提示 */
	},
	is_paging_tools: false,
	/* ===可选===，默认是true，控制是否需要翻页工具 */
	is_load_all_data: true,
	/* ===可选===，默认是true
											   目前存在两种情况的数据加载，第一种是从服务器加载全部可显示数据，然后在本地
										   翻页操作时不再向服务器请求数据；第二种情况是数据太多，没法全部加载在本地，因此
										   需要一页一页地去服务器请求数据。如果是第二种情况，那么这里要设置成false，每次
										   翻页时重新向服务器请求数据。
											   在第一种情况中，页面的勾选操作是可以记忆的，比如勾选了部分数据，然后翻页，在
										   翻页回来，是可以保持勾选状态的，但是第二种情况中，勾选功能不能记忆
											*/
	render: list_panel_render,
	/* ===可选===，渲染每列数据 */
	check_obj: null,
	/* ===可选===，当有数据需要检查才刷新时提交此对象 */
	event_handler: {
		before_load_data: function(list_obj) {
			/*
			 * ===可选事件函数===，在用户调用update_info( true ) 时，系统向服务器重新加载数据之前调用此函数
			 *
			 * 参数： -- list_obj	  ==可选==，列表面板实例
			 * 返回：无
			 */
		},
		after_load_data: function(list_obj, response) {
			/*
			 * ===可选事件函数===，在用户调用update_info( true ) 后，并且服务器响应后调用此函数
			 *
									
			 * 参数： -- add_obj	==可选==，添加面板实例，用户可以通过add_obj.show_
			 *		-- response   ==可选==, 服务器响应的数据
			 * 返回：无
			 */
		}
	},
	panel_header: [{
		enable: true,
		type: "text",
		title: "库名",
		name: "name",
		width: "40%"
	}, {
		enable: true,
		type: "text",
		title: "当前版本",
		name: "version",
		width: "30%"
	}, {
		enable: true,
		type: "text",
		title: "升级有效期",
		name: "deadline",
		width: "30%"
	}],
}
var safeEvent_panel_config = {
	url: ass_url,
	/* ***必填***，控制数据在哪里加载数据 */
	check_in_id: "safeEvent_panel",
	/* ***必填***，确定面板挂载在哪里 */
	panel_name: "safeEventPanel",
	/* ==*可选*==，默认名字my_list_panel，当一个页面存在多个列表面板，此字段必填，
												以区别不同面板 */
	page_size: 9,
	/* ===可选===，控制数据项默认加载多少条，默认是15，此处可以在加载数据过程中更改，
									 更改方法是从服务器加载数据到浏览器时，传一个page_size字段到浏览器 */
	/*panel_title: "列表面板",		 ===可选===，面板的标题 */
	tr_class: {
		even_class: 'even_class_self',
		odd_class: 'odd_class_self'
	},
	is_panel_closable: false,
	/* ===可选===，默认是false，控制面板是否可关闭 */
	is_modal: false,
	/* ===可选===，默认是false，控制面板是否模态显示 */
	modal_config: { /* ===可选===，当想控制模块框大小层次时创建，并且在is_modal为true时才生效 */
		modal_box_size: "l",
		/* ===可选===，默认是l，有l、m、s三种尺寸的模态框 */
		modal_level: 10,
		/* ===可选===，默认是10，数字越大，模态框弹得越上层，可以在其他模态框之上 */
		modal_box_position: "fixed" /* ===可选===，position属性值，目前未使用，未调试成功，建议不使用此字段 */
	},
	is_default_search: false,
	/* ===可选===，默认是true，控制搜索框是否展示，
												注意：这里的搜索条件会在用户每次加载数据前提交到服务器，搜索的实现，
											要在服务端根据提交上来的条件自行实现，这里并不会提供默认的搜索功能
								 */
	default_search_config: { /* ===可选===，只有当is_default_search为true时才生效 */
		input_tip: "输入某字段关键字以查询...",
		/* ===可选===，控制搜索输入框内的提示，默认是“输入关键字以查询...” */
		title: "某字段关键字" /* ===可选===，控制搜索输入框左边的提示，默认无提示 */
	},
	is_paging_tools: false,
	/* ===可选===，默认是true，控制是否需要翻页工具 */
	is_load_all_data: true,
	/* ===可选===，默认是true
											   目前存在两种情况的数据加载，第一种是从服务器加载全部可显示数据，然后在本地
										   翻页操作时不再向服务器请求数据；第二种情况是数据太多，没法全部加载在本地，因此
										   需要一页一页地去服务器请求数据。如果是第二种情况，那么这里要设置成false，每次
										   翻页时重新向服务器请求数据。
											   在第一种情况中，页面的勾选操作是可以记忆的，比如勾选了部分数据，然后翻页，在
										   翻页回来，是可以保持勾选状态的，但是第二种情况中，勾选功能不能记忆
											*/
	render: list_panel_render,
	/* ===可选===，渲染每列数据 */
	check_obj: null,
	/* ===可选===，当有数据需要检查才刷新时提交此对象 */
	class: "thead-class",
	event_handler: {
		before_load_data: function(list_obj) {
			/*
			 * ===可选事件函数===，在用户调用update_info( true ) 时，系统向服务器重新加载数据之前调用此函数
			 *
			 * 参数： -- list_obj	  ==可选==，列表面板实例
			 * 返回：无
			 */
		},
		after_load_data: function(list_obj, response) {
			/*
			 * ===可选事件函数===，在用户调用update_info( true ) 后，并且服务器响应后调用此函数
			 *
									
			 * 参数： -- add_obj	==可选==，添加面板实例，用户可以通过add_obj.show_
			 *		-- response   ==可选==, 服务器响应的数据
			 * 返回：无
			 */
		}
	},
	panel_header: [{
		enable: true,
		type: "text",
		title: "类型",
		name: "type",
		width: "30%"
	}, {
		enable: true,
		type: "text",
		title: "拦截/记录次数",
		name: "hit",
		width: "30%"
	}, {
		enable: true,
		type: "text",
		title: "最近发生时间",
		name: "time",
		width: "40%"
	}],
}

var interface_render = {
	'net_status': {
		render: function(default_data, data_item) {
			if (default_data == 1) {
				return '<span class="net_image"></span>'
			} else {
				return '<span class="dis_net_image"></span>'
			}
		}
	},
	'rx': {
		render: function(default_data, data_tem) {
			var scale = face_unit == 'B' ? 1 : 8;
			return PreferSpeed1024(default_data * scale, face_unit, 2, '/s');
		}
	},
	'tx': {
		render: function(default_data, data_tem) {
			var scale = face_unit == 'B' ? 1 : 8;
			return PreferSpeed1024(default_data * scale, face_unit, 2, '/s');
		}
	}
}
var interface_panel_config = {
	url: ass_url,
	/* ***必填***，控制数据在哪里加载数据 */
	check_in_id: "interface_panel",
	/* ***必填***，确定面板挂载在哪里 */
	panel_name: "interfacePanel",
	/* ==*可选*==，默认名字my_list_panel，当一个页面存在多个列表面板，此字段必填，
												以区别不同面板 */
	page_size: 9,
	/* ===可选===，控制数据项默认加载多少条，默认是15，此处可以在加载数据过程中更改，
									 更改方法是从服务器加载数据到浏览器时，传一个page_size字段到浏览器 */
	/*panel_title: "列表面板",		 ===可选===，面板的标题 */
	render: interface_render,
	tr_class: {
		even_class: 'even_class_self',
		odd_class: 'odd_class_self'
	},
	is_panel_closable: false,
	/* ===可选===，默认是false，控制面板是否可关闭 */
	is_modal: false,
	/* ===可选===，默认是false，控制面板是否模态显示 */
	modal_config: { /* ===可选===，当想控制模块框大小层次时创建，并且在is_modal为true时才生效 */
		modal_box_size: "l",
		/* ===可选===，默认是l，有l、m、s三种尺寸的模态框 */
		modal_level: 10,
		/* ===可选===，默认是10，数字越大，模态框弹得越上层，可以在其他模态框之上 */
		modal_box_position: "fixed" /* ===可选===，position属性值，目前未使用，未调试成功，建议不使用此字段 */
	},
	is_default_search: false,
	/* ===可选===，默认是true，控制搜索框是否展示，
												注意：这里的搜索条件会在用户每次加载数据前提交到服务器，搜索的实现，
											要在服务端根据提交上来的条件自行实现，这里并不会提供默认的搜索功能
								 */
	default_search_config: { /* ===可选===，只有当is_default_search为true时才生效 */
		input_tip: "输入某字段关键字以查询...",
		/* ===可选===，控制搜索输入框内的提示，默认是“输入关键字以查询...” */
		title: "某字段关键字" /* ===可选===，控制搜索输入框左边的提示，默认无提示 */
	},
	is_paging_tools: false,
	/* ===可选===，默认是true，控制是否需要翻页工具 */
	is_load_all_data: true,
	/* ===可选===，默认是true
											   目前存在两种情况的数据加载，第一种是从服务器加载全部可显示数据，然后在本地
										   翻页操作时不再向服务器请求数据；第二种情况是数据太多，没法全部加载在本地，因此
										   需要一页一页地去服务器请求数据。如果是第二种情况，那么这里要设置成false，每次
										   翻页时重新向服务器请求数据。
											   在第一种情况中，页面的勾选操作是可以记忆的，比如勾选了部分数据，然后翻页，在
										   翻页回来，是可以保持勾选状态的，但是第二种情况中，勾选功能不能记忆
											*/
	render: interface_render,
	/* ===可选===，渲染每列数据 */
	check_obj: null,
	/* ===可选===，当有数据需要检查才刷新时提交此对象 */
	event_handler: {
		before_load_data: function(list_obj) {
			/*
			 * ===可选事件函数===，在用户调用update_info( true ) 时，系统向服务器重新加载数据之前调用此函数
			 *
			 * 参数： -- list_obj	  ==可选==，列表面板实例
			 * 返回：无
			 */
		},
		after_load_data: function(list_obj, response) {
			/*
			 * ===可选事件函数===，在用户调用update_info( true ) 后，并且服务器响应后调用此函数
			 *
									
			 * 参数： -- add_obj	==可选==，添加面板实例，用户可以通过add_obj.show_
			 *		-- response   ==可选==, 服务器响应的数据
			 * 返回：无
			 */
		}
	},
	panel_header: [{
		enable: true,
		type: "action",
		title: "网口状态",
		name: "net_status",
		width: "12%",
		td_class:"align-center"
	}, {
		enable: true,
		type: "text",
		title: "接口",
		name: "interface",
		width: "10%"
	}, {
		enable: true,
		type: "text",
		title: "区域",
		name: "zone",
		width: "16%"
	}, {
		enable: true,
		type: "text",
		title: "IP地址",
		name: "ip",
		width: "24%"
	}, {
		enable: true,
		type: "text",
		title: "上行",
		name: "rx",
		width: "14%"
	}, {
		enable: true,
		type: "text",
		title: "下行",
		name: "tx",
		width: "14%"
	}],


};
var colorArr = ['rgb(84,217,66)', 'rgb(251,216,122)', '#f51f1f'];

var interface_panel = new PagingHolder(interface_panel_config);
var safeEvent_panel = new PagingHolder(safeEvent_panel_config);
var list_panel = new PagingHolder(list_panel_config);

function my_do_request(sending_data, fn) {
	return $.ajax({
		type: 'POST',
		url: ass_url,
		data: sending_data,
		dataType: 'json',
		async: true,
		error: function(request) {
			// console.log("返回数据格式有误,请检查");
		},
		success: fn
	});
}

function validateLocalStorage(obj) {
	var obj_key = ['sys_config', 'interface_config', 'safeEvent_config', 'throughput_config'];
	for (var i = 0; i < obj_key.length; i++) {
		if (!obj.hasOwnProperty(obj_key[i])) {
			obj[obj_key[i]] = fsArr_default[obj_key[i]];
		}
	}
	for (var key in obj) {
		if (!/^true|false$/.test(obj[key]['isAutoFresh'])) {
			obj[key]['isAutoFresh'] = fsArr_default[key]['isAutoFresh'];
		}
		if (!parseInt(obj[key]['interval'])) {
			obj[key]['interval'] = fsArr_default[key]['interval'];
		}
	}
	var o_i_f = obj.interface_config.face_unit;
	obj.interface_config.face_unit = o_i_f===undefined ? 'B' : o_i_f.toUpperCase() == 'B' ? o_i_f : 'B';

	var o_t_u = obj.throughput_config.unit;
	obj.throughput_config.unit = {'b': 'b','B': 'B'}[o_t_u] || 'B';

	var o_t_c = obj.throughput_config.clock;
	obj.throughput_config.clock = {'M': 'M','B': 'B','DAY': 'DAY'}[o_t_c] || 'H';

	var o_t_z = obj.throughput_config.zone;
	obj.throughput_config.zone = /^(RED|GREEN|ORANGE)[0-9A-Za-z_]*$/.test(o_t_z) ? o_t_z : {'GREEN': 'GREEN','ORANGE': 'ORANGE'}[o_t_z] || 'GREEN';
	localStorage.setItem('dev', JSON.stringify(obj));
	dev = obj;
}

var xhr_dic = {};

function refreshPanel(panel_name_str, panel_name) {
	try {
		xhr_dic[panel_name_str].abort()
	} catch (err) {};
	var sending_data = {
		ACTION: 'load_data',
		panel_name: panel_name_str
	}

	function onreciveData(data) {
		panel_name.refresh_list_panel({
			'page_size': data.table.total_num
		});
		panel_name.detail_data = data.table.detail_data;
		panel_name.total_num = data.table.total_num;
		panel_name.update_info();
		if (panel_name_str == 'list_panel') {
			var spanArr = $("#info_list li").find("span");

			setProgressBar('cpu_bar', data.cpu * 100);
			setProgressBar('disk_bar', data.disk * 100);
			setProgressBar('memory_bar', data.memory * 100);

			$("#cpu_value").text(Math.ceil(data.cpu * 100) + "%");
			$("#disk_value").text(Math.ceil(data.disk * 100) + "%");
			$("#memory_value").text(Math.ceil(data.memory * 100) + "%");
			spanArr.each(function(i, v) {
				var attr1 = $(v).attr('name');
				$(v).text(data[attr1]);
			})


		}
	}
	xhr_dic[panel_name_str] = my_do_request(sending_data, onreciveData);
}

/*PT: 色谱 start*/
function mapColor(percent){
	/*非线性对应*/
	var delta = -50;
	return Math.ceil(((percent+delta)^2)/((100+delta)^2)*100);
}
function getColorByPercent(percent){  
	//var 百分之一 = (单色值范围) / 50;  单颜色的变化范围只在50%之内  
	var one = (255+255) / 100;	
	var r=0;  
	var g=0;  
	var b=30;  
	percent = mapColor(percent)
	if ( percent < 50 ) {   
		// 比例小于50的时候红色是越来越多的,直到红色为255时(红+绿)变为黄色.  
		r = one * percent;  
		g=255;  
	}  
	if ( percent >= 50 ) {  
		// 比例大于50的时候绿色是越来越少的,直到0 变为纯红  
		g =  255 - ( (percent - 50 ) * one) ;  
		r = 255;  
	}  
	r = parseInt(r);// 取整  
	g = parseInt(g);// 取整  
	b = parseInt(b);// 取整  
	return {r:r,g:g,b:b}
}  
/*PT: 色谱 end*/
function setProgressBar(e, v) {
	var value = Math.ceil(v);
	var color = "";
	$("#" + e).progressbar({
		value: value
	});
	var rgb = getColorByPercent(v);
	var r,g,b;
	r = rgb.r;
	g = rgb.g;
	b = rgb.b;
	color = 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
	if(r - 40 > 0) r -= 40;
	if(g - 40 > 0) g -= 40;
	color_border = 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
	$("#" + e + " .ui-widget-header").css({
		'background': color,
		'border': 'none'
	})
	$("#" + e).css({
		'border-color': color_border
	});
}

function refreshSys() {
	refreshPanel('list_panel', list_panel);
}

function refreshInterface() {
	refreshPanel('interface_panel', interface_panel);
}

function refreshSafeEvent() {
	refreshPanel('safeEvent_panel', safeEvent_panel);
}

var throuhght_put_ec_max_len = 50;
var ec_first_ok = true;
var last_update_time = (new Date()).valueOf();
var throughput_delta = 8;
function now(){
	return (new Date()).valueOf();
}
function refreshChart(f, force,click) { /*支持调用函数强制整体刷新, 由于可能因为刷新太快导致图标始终不显示，所以第二个参数代表是否屏蔽太快的请求*/
	if (click) {
		real_time_chart.showLoading({
			text:"加载中",
			effect:"whirling",
			textStyle : {
				fontSize : 20
			}
		})
	}
	try {
	// console.log(f,!force, !ec_first_ok,(now() - last_update_time)< throughput_delta*1000);
		if (!force && (!ec_first_ok && (now() - last_update_time) < throughput_delta*1000)){
		// console.log('刷新太快了');
		return;
		}else{
		// console.log('正常刷新');
	}; 
		xhr_dic['throught'].abort();
	last_update_time = now();

	} catch (err) {};
	if (f !== undefined || (f===undefined && refreshChart.refreshFlag == true)) { // 如果设置了first标记或者是初始状态
		refreshChart.refreshFlag = true;
	// console.log('第一次设置ec_first_ok false')
	ec_first_ok = false;
	}
	var flag = (refreshChart.refreshFlag === true) ? 1 : 0;

	if (dev === null) {
		localStorage.setItem('dev', JSON.stringify(fsArr_default));
		dev = fsArr_default;
	}
	validateLocalStorage(dev);

	var _c = dev['throughput_config']['clock'];
	var _u = dev['throughput_config']['unit'];
	var _z = dev['throughput_config']['zone'];
	xhr_dic['throught'] = my_do_request({
		ACTION: 'load_echart_data',
		type: 'throughput',
		clock: _c,
		unit: _u,
		zone: _z,
		flag: flag
	}, function(data) {
		// console.log(data.ec_data.tx.xAxis.length);
		// var opt = real_time_chart.getOption();
	last_update_time = now();
		unitFlag = _u;
		$("#tx_value").text(data.tx);
		$("#rx_value").text(data.rx);
		var ec_data = data.ec_data;
		if (refreshChart.refreshFlag) {
			real_time_chart.clear();
			throuhght_put_ec_max_len = ec_data.points_cnt;
			echart_option.xAxis[0].data = ec_data.tx.xAxis;
			echart_option.series[0].data = ec_data.tx.yAxis;
			echart_option.series[1].data = ec_data.rx.yAxis;
		ec_first_ok = true;
		} else {
			if (_c == 'M') { // 只有实时才推，其他情况下图不推 
				if (echart_option.xAxis[0].data.length >= throuhght_put_ec_max_len) {
					echart_option.xAxis[0].data.shift();
					echart_option.series[0].data.shift();
					echart_option.series[1].data.shift();

				}

				echart_option.xAxis[0].data.push(ec_data.tx.xAxis[0]);
				echart_option.series[0].data.push(ec_data.tx.yAxis[0]);
				echart_option.series[1].data.push(ec_data.rx.yAxis[0]);
			}
		}
		echart_option.yAxis.name = _u + "/s";
		real_time_chart.hideLoading();
		real_time_chart.setOption(echart_option);

		refreshChart.refreshFlag = false;
	})
}
refreshChart.refreshFlag = true;

function showPanel(e) {

    $("#" + e).parent(".config_panel").show().css({
        'margin-left': -($("#" + e).width()/2)+'px',
        'margin-top': -($("#" + e).height()/2)+'px'
    });
    $("#" + e).parent().prev(".popup-mesg-box-cover").show();
}

function hidePanel(e) {
	$("#" + e).parent(".config_panel").hide();
	$("#" + e).parent().prev(".popup-mesg-box-cover").hide();
	fillData(e);
}

function fillData(e) {
	if (dev === null) {
		localStorage.setItem('dev', JSON.stringify(fsArr_default));
		dev = fsArr_default;
	}
	validateLocalStorage(dev);
	if (e == 'throughput_config') {
		$("#" + e + " form").find("input[name='clock'][value='" + dev[e]['clock'] + "']").prop('checked', true);
		$("#" + e + " form").find("input[name='unit'][value='" + dev[e]['unit'] + "']").prop('checked', true);
		$("#throughtout_zone").find("option[value='" + dev[e]['zone'] + "']")[0].selected = true;

	}
	$("#" + e + " form").find("input[name='isAutoFresh']").prop("checked", dev[e]['isAutoFresh']);
	$("#" + e + " form").find("input[name='interval']").val(dev[e]['interval']);


}

function save_config(e) {
	
	var str = $("#" + e + " form").serialize();
	var strArr = str.split("&");
	//判断localStorage是否存在
	if (dev === null) {
		localStorage.setItem('dev', JSON.stringify(fsArr_default));
		dev = fsArr_default;
	}
	validateLocalStorage(dev);
	strArr.forEach(function(v, i) {
		var tempArr = v.split("=");
		var name = tempArr[0];
		var value = tempArr[1];
		dev[e][name] = value;
	});
	if (str.indexOf('isAutoFresh') == -1) { //自动刷新未选中
		dev[e]['isAutoFresh'] = false
	} else {
		dev[e]['isAutoFresh'] = true;

	}

	localStorage.setItem('dev', JSON.stringify(dev)); //将新设置的信息存储在浏览器上
	if (e == 'throughput_config') {
		real_time_chart.showLoading({
			text:"加载中",
			effect:"whirling",
			textStyle : {
				fontSize : 20
			}
		})
		// refreshChart.refreshFlag = true;
		var text = $("#throughtout_zone").find("option[value=" + dev[e]['zone'] + "]").text();
		$("#throughput_config_title").text(text);
		refreshChart(true, true);
	} else if (e == 'interface_config') {
		face_unit = dev[e]['face_unit'];
		interface_panel.update_info(); // 无刷新的更新数据
	}
	hidePanel(e);
}


function initOption() {
	my_do_request({
		ACTION: "initOption"
	}, function(data) {
		var html = "";
		for (var i = 0; i < data.options.length; i++) {
			html += '<option value ="' + data.options[i].value + '">' + data.options[i].text + '</option>';
		}
		$("#throughput_config form").find("select[name='zone']").append(html);
		validateLocalStorage(dev);
		$("#throughtout_zone").find("option[value='" + dev['throughput_config']['zone'] + "']")[0].selected = true;
		var text = $("#throughtout_zone").find("option[value=" + dev['throughput_config']['zone'] + "]").text();
		$("#throughput_config_title").text(text);
	})
}

function change_width() {
	real_time_chart.resize();
	$('#real_time_fresh canvas').height($(".module").height() * 250 / 312);
	if (document.body.clientWidth < 1040) {
		$('.module').css('width', '100%');
	} else {
		$('.module').css('width', '49%');
	}
}
