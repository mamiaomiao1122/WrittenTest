$(document).ready(function(){
    add_panel = new RuleAddPanel( add_panel_config );
    list_panel = new PagingHolder( list_panel_config );
    user_group_panel = new PagingHolder( user_group_panel_config);
    message_manager = new MessageManager( message_box_config );
    SrcIPGroup_panel = new PagingHolder(SrcIPGroup_config);
    DestIPGroup_panel = new PagingHolder(DestIPGroup_config);
    
    /* 渲染面板 */
    add_panel.render();
    list_panel.render();
    message_manager.render();
    user_group_panel.render();
    SrcIPGroup_panel.render();
    SrcIPGroup_panel.hide();
    DestIPGroup_panel.render();
    DestIPGroup_panel.hide();

    /* 设置面板关联 */
    add_panel.set_ass_list_panel( list_panel );
    list_panel.set_ass_add_panel( add_panel );
    
    add_panel.set_ass_message_manager( message_manager );
    list_panel.set_ass_message_manager( message_manager );
    user_group_panel.set_ass_message_manager( message_manager );

    add_panel.hide();
    user_group_panel.hide();
    list_panel.update_info(true);

    $("#search_key_for_list_panel").css("font-size","5px");
    $("#search_key_for_list_panel").attr("placeholder","支持名称,源IP,协议,关键字查询");

    /*将添加命令的每一项（包括http、smtp、pop3、ftp、telnet）
      进行一个异步初始化，初始化后的值先隐藏*/
    list_panel.request_for_json({ACTION:'init_cmdList'},function(data){
        cmdList_json = data; 
    })
    // single_select();

	!function() { 
        /*!function()，表示为自动运行该函数
          attr()函数为设置或返回属性值
          disable属性，为禁用input元素
          bind()函数，为被选元素添加一个或多个事件处理程序，并规定事件发生时运行函数
          not()函数，从匹配元素集合中删除被选元素
          display属性，规定元素应该生成框的类型
          gt()选择器，选择index大于制定数字的元素
          append()函数，在被选元素的结尾插入指定内容*/
		$("ip_group_value,#user_group_value,#single_time_value,#circle_time_value").attr("disabled",true);
		$(".ctr_inpt").css("width","50px");
		$("input[name='url_type']").bind('click', function(){
			$("input[name='url_type']").not(this).attr("checked", false);
		});	
		$("#protocolType").css("display", "none");
        $("#protocol option:gt(2)").attr("disabled","disabled");//将option的index值大于2的选项设为disabled
        $("#filter_type_item td:eq(1) div.add-panel-form-item:eq(1)").hide();//eq(0)为关键字栏，eq(1)为命令栏，初始化将命令栏隐藏
        $("#cmdList").attr("disabled","disabled"); //cmdList为命令栏的id，初始化将其设为不可选
        //$("#cmdList").append(createOption(cmdList_json.http)); //?
	}();
});

var ass_url = "/cgi-bin/file_type_filter.cgi";
var object_selected = [];
var object_selected_names = [];
var object_selected_temp = [];
var object_selected_name_temp = [];
var edit_id = "";
var list_panel;
var add_panel;
var user_group_panel;
var analysis_panel;
var message_box_config = {
    url: "/cgi-bin/keywordfilter.cgi",
    check_in_id: "mesg_box_tmp",
    panel_name: "my_message_box",
}
var message_manager;

var user_group_panel_config = {
    url: "/cgi-bin/file_type_filter.cgi",
    check_in_id: "panel_uesr_group",
    panel_name: "user_group_panel",
    page_size: 0,
    panel_title: "配置用户组",
    is_panel_stretchable:true,
    is_panel_closable: true,
    is_default_search: false,
    is_paging_tools: false,
    is_modal: true,
    is_first_load: true,
    // render: monitoring_object_render,
    modal_config: {
        modal_box_size: "s",
        modal_level: 20
    },
    event_handler: {
        before_load_data: function( list_obj,data_item ) {
            
        },
        after_load_data: function( list_obj,data_item ) {
           
        }
    },
    panel_header: [{
        enable: false,
        type: "checkbox",
        name: "checkbox",
        width: "10%"
    }, {
        enable: false,
        type: "text",
        title: "用户组",
        name: "user_name"
    }],
    bottom_extend_widgets: {
        class: "add-panel-footer",
        sub_items: [{
            enable: true,
            type: "image_button",
            style: "margin-top: 5px;margin-bottom: 5px;",
            button_text: "确定",
            functions: {
                onclick: "write_checked_for_jstree(user_group_panel,'SrcUserlist','user','srcIpGroupId');"
            }
        }, {
            enable: true,
            type: "image_button",
            button_text: "取消",
            style: "margin-top: 5px;margin-bottom: 5px;",
            functions: {
                onclick: "user_group_panel.hide();"
            }
        }]
    }

};
var SrcIPGroup_panel;
var DestIPGroup_panel;
var cmdList_json;

var add_panel_config = {
    url: "/cgi-bin/keywordfilter.cgi",
    check_in_id: "panel_tmp_add",
    panel_name: "add_panel",
    rule_title: "配置",
    is_modal: true,
    modal_config: {
        modal_box_size: "m",
        modal_level: 10
    },
    event_handler: {
        before_save_data: function( add_obj,data_item ) {

            // ip组或用户组必须选择值
            // var check_null_obj = {
            //     '#ip_or_user': {
            //         'sour_ip': ['#SrcIPGroup', '源IP/组/用户/MAC 中 IP组 '],
            //         'sour_user': ['#SrcUserlist', '源IP/组/用户/MAC 中 用户 '],
            //         'sour_netip': ['#sour_netip_text', '源IP/组/用户/MAC 中 网络/IP '],
            //         'sour_mac': ['#sour_mac_text', '源IP/组/用户/MAC 中 MAC ']
            //     },
            //     '#dest_ipgroup': {
            //         'dest_ip': ['#DestIPGroup', '目标IP/组 中 目的IP '],
            //         'dest_group': ['#dest_ip_text', '目标IP/组 中 网络/IP ']
            //     }
            // };

            // for (var k in check_null_obj) {
            //     for (var b in check_null_obj[k]) {
            //         if ($(k).val() == b && $(check_null_obj[k][b][0]).val() == '') {
            //             message_manager.show_popup_error_mesg(check_null_obj[k][b][1] + '不能为空');
            //             return false;
            //         }
            //     }
            // }
          // 动作按钮也必须选择一样
          var action_length = $("input[name='action_permission']:checked").length;
          if( action_length == 0 ){
               message_manager.show_popup_note_mesg( "至少选择一个动作" );
              return false;
          }

           // 将edit_id置空
          edit_id = "";


        },
        before_load_data: function( add_obj,data_item ) {
           console.log(data_item);
           console.log(data_item.cmdList);
           read_data();
           radioChang(data_item.filter_type);
           selectChange(data_item.protocol);
           if(data_item.protocolType) {
                $("#protocolType").css("display", "inline-block");
            }else {
                $("#protocolType").css("display", "none");
            }
		   
		},
        after_load_data: function( add_obj,data_item ) {
            select_items(data_item.dest_ipgroup,'dest_ipgroup');
            select_items(data_item.ip_or_user,'ip_or_user');
            select_items(data_item.time_plan,'time_plan');
            select_items(data_item.service_or_app,'service_app');

            var ip_mac_text = $('#sour_netip_text,#sour_mac_text,#dest_ip_text');
            for (var i = 0; i < ip_mac_text.length; i++) {
                var text_val = $(ip_mac_text[i]).val();
                text_val = text_val.replace(/\s/g,'');
                text_val = text_val.replace(/\,|，/g,'\n');
                $(ip_mac_text[i]).val(text_val);
            }
		
        },
        after_cancel_edit: function( add_obj ) {
             // 将edit_id置空
             edit_id = "";
            $("#SrcIPGroup,#SrcIPGroup_btn,#SrcUserlist,#SrcUserlist_btn,#sour_netip_text,#sour_mac_text").hide();
            $("#DestIPGroup,#ipGroup,#dest_ip_text").hide();
            $("#ServiceName,#ServiceName_btn,#Appname,#Appid_btn").hide();
        }
        
    },
    is_panel_stretchable: false,
    is_panel_closable: true,
    items_list:[
        {
            title: "名称*",
            sub_items: [
                {
                    enable: true,
                    type: "text",
                    id: "name",
                    name: "name",
                    value: "",
                    style: "",
                    functions: {
                    },
                    check: {
                        type: "text",
                        required: 1,
                        check:'name|',
                        // other_reg:'^$',
                        ass_check: function( check ) {

                        }
                    }
                }
            ]
        },
        {
            title: "描述",
            sub_items: [
                {
                    enable: true,
                    type: "text",
                    style: "", 
                    id: "description",
                    name: "description",
                    functions: {
                    
                    },
                      check: {
                        type:'text',
                        required:'0',
                        check:"note",
                        ass_check:function( check ){
                            
                        }
                    }

                }
            ]
        },{
        title: "源IP/组/用户",
        sub_items: [{
            enable: true,
            type: "items_group",
            style: " margin:-5px;",
            sub_items: [{
                enable: true,
                type: "select",
                id: "ip_or_user",
                name: "ip_or_user",
                value: "",
                style: "width:69px;   vertical-align: text-top;",
                functions: {
                    onchange: "select_items(this.value,this.id);"
                },
                options: [{
                        text: "任意",
                        id: "sour_any",
                        value: "sour_any",
                        functions: {}
                    }, {
                        text: "IP组",
                        id: "sour_ip",
                        value: "sour_ip",
                        functions: {}
                    }, {
                        id: "sour_user",
                        text: "用户",
                        value: "sour_user",
                        functions: {},
                    }, {
                        text: "网络/IP",
                        id: "sour_netip",
                        value: "sour_netip",
                        functions: {}
                    }

                ]
            }, {
                enable: true,
                id: "SrcIPGroup",
                name: "SrcIPGroup",
                type: "text",
                readonly: "readonly",
                style: "height:16px;width:117px;display:none;",
                check: {
                        type:'text',
                        required:'1',
                        check: 'note',
                        ass_check:function( check ){
                            
                        }
                    }

            }, {
                enable: true,
                id: "SrcIPGroup_btn",
                name: "user_group_btn",
                type: "button",
                class: "set-button",
                value: "配置",
                functions: {
                    onclick: "add_configure_rule(SrcIPGroup_panel);"
                },
                style: "width:40px;height:20px;border-radius:4px;display:none;"
            }, {
                enable: true,
                id: "SrcUserlist",
                name: "SrcUserlist",
                type: "text",
                readonly: "readonly",
                style: "height:16px;width:117px;display:none;",
                check: {
                        type:'text',
                        required:'1',
                        check: 'other|',
                        other_reg: '/.*/',
                        ass_check:function( check ){
                            
                        }
                    }

            }, {
                enable: true,
                id: "SrcUserlist_btn",
                name: "user_group_btn",
                type: "button",
                class: "set-button",
                value: "配置",
                functions: {
                    onclick: "load_jstree_panel(user_group_panel,'load_userlist','SrcUserlist','user')"
                },
                style: "width:40px;height:20px;border-radius:4px;display:none;"
            }, {
                enable: true,
                // label: "请填写IP(每行一个)",
                type: "textarea",
                // tip: "请填写IP(每行一个)",
                id: "sour_netip_text",
                name: "sour_netip_text",
                placeholder: "请填写IP(每行一个)",
                style: "width:119px;display:none;vertical-align: middle;",
                readonly: false,
                check: {
                    type: 'textarea',
                    required: '1',
                    check: 'ip|ip_addr_segment',
                    ass_check: function(check) {

                    }
                }
        
            }, {
                enable: true,
                style:"display:none;",
                id: "SrcIPGroupIds",
                name: "SrcIPGroupIds",
                type: "text"
            }, {
                enable: true,
                style:"display:none;",
                id: "SrcUserlistIds",
                name: "SrcUserlistIds",
                type: "text"
            }]


        }]
    },
        {
            title: "过滤类型",
            sub_items: [
                {
                        enable:true,
                        label:"关键字",
                        type:"radio",
                        id:"keyWordID",
                        checked: "checked",
                        name:"filter_type",
                        value:"0",
                        functions:{
                            onclick:"radioChang(this.value);"
                        }
                },
                {
                        enable:true,
                        label:"命令",
                        type:"radio",
                        id:"cmdID",
                        name:"filter_type",
                        value:"1",
                        functions:{
                            onclick:"radioChang(this.value);"
                        }
                }
            ]
        },
        {
            title: "协议",
            sub_items: [
                {
                    enable: true,
                    type: "select",
                    style: "width:200px", 
                    id: "protocol",
                    name: "protocol",
                    options:
                    [
                            {
                                text:"HTTP",
                                value:"http"
                            },
                            {
                                text:"SMTP",
                                value:"smtp"
                            },
                            {
                                text:"POP3",
                                value:"pop3"
                            },
                            {
                                text:"FTP",
                                value:"ftp"
                            },
                            {
                                text:"TELNET",
                                value:"telnet"
                            }
                    ],
                    functions: {
						"onchange": "selectChange(this.value)"
                    },
                    check: {
                        type:'select-one',
                        required:'1',
                        ass_check:function( check ){
                            
                        }
                    }

                },{
					enable: true,
					type: "items_group",
					id: "protocolType",
					sub_items:[
						{
							enable: true,
							type: "radio",
							name: "protocolType",
							id: "tex",
							value: "tex",
							label: "邮件正文"
						},
						{
							enable: true,
							type: "radio",
							name: "protocolType",
							id: "sys",
							value: "sys",
							label: "邮件主题"
						},{
							enable: true,
							type: "radio",
							name: "protocolType",
							id: "sen",
							value: "sen",
							label: "发件人"
						},{
							enable: true,
							type: "radio",
							name: "protocolType",
							id: "rec",
							value: "rec",
							label: "收件人"
						}
					]
				}
            ]
        },
        {
            title: "关键字*",
            id:"filter_type_item",
            sub_items: [
                {
                    enable: true,
                    type: "text",
                    style: "",
                    id: "gate",
                    name: "gate",
                    functions: {
                    
                    },
                      check: {
                        type:'text',
                        required:'1',
						check:'other|',
						other_reg: '/.*/',
                        ass_check:function( check ){
                            
                        }
                    }

                },{
                    enable: true,
                    type: "select",
                    style: "", 
                    id: "cmdList",
                    name: "cmdList",
                    options:[],
                    functions: {
                        //"onchange": "selectChange()"
                    },
                    check: {
                        type:'select-one',
                        required:'1',
                        ass_check:function( check ){
                            
                        }
                    } 
                }
            ]   
        },
        {
            title:"日志",
            sub_items:[{
                enable:true,
                type:"checkbox",
                label:"记录",
                id:"is_record",
                name:"is_record",
                value:"0",
            }]
        },
        {
            title:"动作",
                sub_items:[
                    {
                        enable:true,
                        label:"允许 ",
                        type:"radio",
                        id:"permit",
                        checked: "checked",
                        name:"action_permission",
                        value:"0",
                    },
                    {
                        enable:true,
                        label:"拒绝",
                        type:"radio",
                        id:"forbid",
                        name:"action_permission",
                        margin:"10px",
                        value:"1",
                    }
                ]
        },
        {
            title:"启用",
            sub_items:[{
                enable:true,
                type:"checkbox",
                name:"enable",
                id:"enable",
                value:"on"
            }]
        }]
};

var SrcIPGroup_render = {
    /*'protocol': {
         render: function( default_rendered_text, data_item ) {
             var result_render = "RIP";
             return '<span>' + result_render + '</span>';
         },
     },*/

};

var SrcIPGroup_config = {
    url: ass_url, // ***必填***，控制数据在哪里加载 
    check_in_id: "SrcIPGroup_panel", // ***必填***，确定面板挂载在哪里 
    page_size: 10, //===可选===，定义页大小，默认是15 
    panel_name: "SrcIPGroup_panel", // ==*可选*==，默认名字my_list_panel，当一二个页面存在多个相同的面板，此字段必填，以区别不同面板 
    is_load_all_data: true, // ===可选===，默认是true,如果设置成false，翻页回重新加载数据，并且记忆功能不能使用 
    panel_title: "配置源IP",
    is_panel_closable: true,
    is_paging_tools: false,
    is_default_search: false,
    is_modal: true,
    modal_config: {
        modal_box_size: "s",
        modal_level: 11
    },
    render: SrcIPGroup_render, //===可选===，渲染每列数据 
    panel_header: [ // ***必填***，控制数据的加载以及表头显示 
        {
            "enable": true, //用户控制表头是否显示
            "type": "checkbox", //type目前有checkbox/text/radio/action，分别对应不同类型的表头，最一般的还是text
            "title": "", //不同类型的，title需要的情况不同，一般text类型需要title
            "name": "checkbox", //用户装载数据之用
            "class": "", //元素的class
            "td_class": "align-center", //这一列td的class，主要用于控制列和列内元素,此处checkbox的td_class是固定的
            "width": "5%", //所有表头加起来应该等于100%,以精确控制你想要的宽度
            "functions": { //一般只有checkbox才会有这个字段
            }
        }, {
            "enable": false,
            "type": "radio",
            "name": "radio",
            "td_class": "rule-listbc",
            "width": "5%"
        }, {
            "enable": true,
            "type": "name",
            "title": "源IP名称", //一般text类型需要title,不然列表没有标题
            "name": "name",
            "width": "30%"
        }
    ],
    bottom_extend_widgets: {
        id: "",
        name: "",
        class: "align-center",
        sub_items: [{
            enable: true,
            type: "image_button",
            class: "",
            style: "margin-top: 5px;margin-bottom: 5px;",
            button_text: "确定",
            functions: {
                onclick: "write_lib_data(SrcIPGroup_panel,'SrcIPGroup','SrcIPGroupIds');"
            }
        }, {
            enable: true,
            type: "image_button",
            class: "",
            button_text: "取消",
            style: "margin-top: 5px;margin-bottom: 5px;",
            functions: {
                onclick: "SrcIPGroup_panel.hide();"
            }
        }]
    }
}

var DestIPGroup_render = {
    /*'protocol': {
         render: function( default_rendered_text, data_item ) {
             var result_render = "RIP";
             return '<span>' + result_render + '</span>';
         },
     },*/

};

var DestIPGroup_config = {
    url: ass_url, // ***必填***，控制数据在哪里加载 
    check_in_id: "DestIPGroup_panel", // ***必填***，确定面板挂载在哪里 
    page_size: 10, //===可选===，定义页大小，默认是15 
    panel_name: "DestIPGroup_panel", // ==*可选*==，默认名字my_list_panel，当一二个页面存在多个相同的面板，此字段必填，以区别不同面板 
    is_load_all_data: true, // ===可选===，默认是true,如果设置成false，翻页回重新加载数据，并且记忆功能不能使用 
    panel_title: "配置目标IP",
    is_panel_closable: true,
    is_paging_tools: false,
    is_default_search: false,
    is_modal: true,
    modal_config: {
        modal_box_size: "s",
        modal_level: 11
    },
    render: DestIPGroup_render, //===可选===，渲染每列数据 
    panel_header: [ // ***必填***，控制数据的加载以及表头显示 
        {
            "enable": true, //用户控制表头是否显示
            "type": "checkbox", //type目前有checkbox/text/radio/action，分别对应不同类型的表头，最一般的还是text
            "title": "", //不同类型的，title需要的情况不同，一般text类型需要title
            "name": "checkbox", //用户装载数据之用
            "class": "", //元素的class
            "td_class": "align-center", //这一列td的class，主要用于控制列和列内元素,此处checkbox的td_class是固定的
            "width": "5%", //所有表头加起来应该等于100%,以精确控制你想要的宽度
            "functions": { //一般只有checkbox才会有这个字段
            }
        }, {
            "enable": false,
            "type": "radio",
            "name": "radio",
            "td_class": "rule-listbc",
            "width": "5%"
        }, {
            "enable": true,
            "type": "name",
            "title": "目标IP名称", //一般text类型需要title,不然列表没有标题
            "name": "name",
            "width": "30%"
        }
    ],
    bottom_extend_widgets: {
        id: "",
        name: "",
        class: "align-center",
        sub_items: [{
            enable: true,
            type: "image_button",
            class: "",
            style: "margin-top: 5px;margin-bottom: 5px;",
            button_text: "确定",
            functions: {
                onclick: "write_lib_data(DestIPGroup_panel,'DestIPGroup','DestIPGroupIds');"
            }
        }, {
            enable: true,
            type: "image_button",
            class: "",
            button_text: "取消",
            style: "margin-top: 5px;margin-bottom: 5px;",
            functions: {
                onclick: "DestIPGroup_panel.hide();"
            }
        }]
    }
}

var list_panel_render = {

    'direction':{
        render: function(default_text,data_item){
            var rendered_text = default_text;
            if( rendered_text == "upload"){
                rendered_text = "上传";
            }
            else if( rendered_text == "down"){
                rendered_text = "下载";
            }
            else {
                rendered_text = "上传&下载";
            }
            return rendered_text;
        }
    },
    'target_ipgroups':{
        render: function(default_rendered_text, data_item) {
            // data_item.Dest_IP_Group = data_item.Dest_IP_Group.replace(/\,/g,', ');
            // data_item.Dest_IP_Group = data_item.Dest_IP_Group.replace(/\，/g,', ');
            if (data_item.dest_ipgroup == 'dest_any') {
                return '<font style="color:green;">'+data_item.target_ipgroups+'</font>';
            }else if(data_item.dest_ipgroup == 'dest_group'){
                return '<font style="color:green;">网络/IP: </font>'+data_item.target_ipgroups;
            }else{
                return '<font style="color:green;">IP: </font>'+data_item.target_ipgroups;
            }
        }
    },
        'ip_group_value':{
        render: function(default_rendered_text, data_item) {
            data_item.ip_group_value = data_item.ip_group_value.replace(/\,/g,', ');
            data_item.ip_group_value = data_item.ip_group_value.replace(/\，/g,', ');
            if (data_item.ip_or_user == 'sour_user') {
                return '<font style="color:green;">用户: </font>'+data_item.ip_group_value;
            }else if(data_item.ip_or_user == 'sour_mac'){
                return '<font style="color:green;">MAC: </font>'+data_item.ip_group_value;
            }else if(data_item.ip_or_user == 'sour_netip'){
                return '<font style="color:green;">网络/IP: </font>'+data_item.ip_group_value;
            }else if(data_item.ip_or_user == 'sour_ip'){
                return '<font style="color:green;">IP: </font>'+data_item.ip_group_value;
            }else if(data_item.ip_or_user == 'sour_any'){
                return '<font style="color:green;">'+data_item.ip_group_value+'</font>';
            }
        }
    },

    'is_record':{
        render: function(default_text,data_item){
            var rendered_text = default_text;
            if( rendered_text == "0"){
                rendered_text = "开启";
            }
            else{
                rendered_text = "未开启";
            }
            return rendered_text;
        }
    },

    'key_or_cmd':{
        render: function( default_text,data_item){
            var rendered_text = "";
            if(data_item.gate){
                return '<font style="color:green;">关键字: </font>'+data_item.gate;
            }else{
               return '<font style="color:green;">命令类型: </font>'+data_item.cmdList;
            }

        }
    },
    'action_permission':{
         render: function(default_text,data_item){
            var rendered_text = default_text;
            if( rendered_text == "0"){
                rendered_text = "允许";
            }
            else{
                rendered_text = "禁止";
            }
            return rendered_text;
        }
    },
    'enabled_status':{
         render: function(default_text,data_item){
            var rendered_text = default_text;
            if( rendered_text == "on"){
                rendered_text = "启用";
            }
            else{
                rendered_text = "未启用";
            }
            return rendered_text;
        }
    }
    // 'action': {
    //     render: function( default_rendered_text, data_item ) {
    //     var action_buttons = [
    //             {
    //                 "enable": true,
    //                 "id": "edit_item",
    //                 "name": "edit_item",
    //                 "button_icon": "edit.png",
    //                 "button_text": "编辑",
    //                 "value": data_item.id,
    //                 "functions": {
    //                     onclick: "list_panel.edit_item(this.value);"
    //                 },
    //                 "class": "action-image",
    //             },
    //             {
    //                 "enable": true,
    //                 "id": "delete_item",
    //                 "name": "delete_item",
    //                 "button_icon": "delete.png",
    //                 "button_text": "删除",
    //                 "value": data_item.id,
    //                 "functions": {
    //                     onclick: "check_delete_rule(this.value);"
    //                 },
    //                  "class": "action-image",
    //             }
    //         ];
    //         return PagingHolder.create_action_buttons( action_buttons );
    //     }
    // }
};


var list_panel_config = {
    url: "/cgi-bin/keywordfilter.cgi", /* ***必填***，控制数据在哪里加载 */
    check_in_id: "panel_tmp_list",         /* ***必填***，确定面板挂载在哪里 */
    page_size: 20,                  /* ===可选===，定义页大小，默认是15 */
    panel_name: "list_panel",       /* ==*可选*==，默认名字my_list_panel，当一二个页面存在多个相同的面板，此字段必填，以区别不同面板 */
    is_load_all_data: true,         /* ===可选===，默认是true,如果设置成false，翻页回重新加载数据，并且记忆功能不能使用 */
    render: list_panel_render,      /* ===可选===，渲染每列数据 */
    panel_header: [                 /* ***必填***，控制数据的加载以及表头显示 */
        {
            "enable": true,            //用户控制表头是否显示
            "type": "checkbox",         //type目前有checkbox/text/radio/action，分别对应不同类型的表头，最一般的还是text
            "title": "",                //不同类型的，title需要的情况不同，一般text类型需要title
            "name": "checkbox",         //用户装载数据之用
            "class": "",                //元素的class
            "td_class": "align-center",  //这一列td的class，主要用于控制列和列内元素,此处checkbox的td_class是固定的
            "width": "5%",              //所有表头加起来应该等于100%,以精确控制你想要的宽度
            "functions": {              //一般只有checkbox才会有这个字段
            }
        }, {
            "enable": true,
            "type": "text",
            "title": "序号",        //一般text类型需要title,不然列表没有标题
            "name": "index",
            "width": "3%",
            "td_class":"align-center"
        }, {
            "enable": true,
            "type": "text",
            "title": "名称",        //一般text类型需要title,不然列表没有标题
            "name": "name",
            "width": "10%"
        },{
            enable: true,
            type: "text",
            title: "描述",
            name: "description",
            width: "14%"
       },{
            "enable": true,
            "type": "text",
            "title": "源IP/组/用户",
            "name": "ip_group_value",
            "width": "18%"
        },
        {
            "enable": true,
            "type": "text",
            "title": "协议",
            "name": "protocol",
            "width": "10%"
        },
        {
            "enable": true,
            "type": "text",
            "title": "关键字/命令类型",
            "name": "key_or_cmd",
            "width": "20%",
            "td_class":"align-center"
        },
        {
            "enable": true,
            "type": "text",
            "title": "动作",
            "name": "action_permission",
            "width": "10%",
            "td_class":"align-center"
        },
        {
            "enable": false,
            "type": "text",
            "title": "状态",
            "name": "enabled_status",
            "width": "5%",
            "td_class":"align-center"
        },
        {
            "enable": true,
            "type": "action",
            "title": "活动/动作",
            "name": "action",
            "width": "10%",
            "td_class":"align-center"
        }
    ],
    top_widgets: [                  /* ===可选=== */
        {
            enable: true,
            type: "image_button",
            button_icon: "add16x16.png",
            button_text: "新建",
            functions: {
                onclick: "add_rule(this);"
            }
        },
        {
            "enable": true,
            type: "image_button",
            "id": "delete_selected",
            "name": "delete_selected",
            "class": "",
            "button_icon": "delete.png",
            "button_text": "删除选中",
            "functions": {
                onclick: "check_delete_selected_items()"
            }
        },
        {
            "enable": true,
            type: "image_button",
            "id": "delete_selected",
            "name": "delete_selected",
            "class": "",
            "button_icon": "on.png",
            "button_text": "启用选中",
            "functions": {
                onclick: "enable_selected_items()"
            } 
        },
        {
            "enable": true,
            type: "image_button",
            "id": "delete_selected",
            "name": "delete_selected",
            "class": "",
            "button_icon": "off.png",
            "button_text": "禁用选中",
            "functions": {
                onclick: "disable_selected_items()"
            }
        }
    ],
    is_default_search: true,          /* ===可选===，默认是true，控制默认的搜索条件 */
    event_handler: {
        before_load_data: function( list_obj ) {
            
        },
        after_load_data: function ( list_obj, response ) {
          console.log(response);  
        },
    },
    
}
//选择用户组还是ip组
// function single_select(element){
//     if( element == "ip_group"  ){
//         $("#ip_group_value").removeAttr("disabled");
//         $("#user_group_value").val("");
//         $("#user_group_value").attr("disabled",true);
//     }
//     else if(element == "user_group") {
//         $("#user_group_value").removeAttr("disabled");
//         $("#ip_group_value").val("");
//         $("#ip_group_value").attr("disabled",true);
//     }
//     else if(element == "single_plan"){
//        $("#single_time_value").removeAttr("disabled");
//        $("#circle_time_value").val("");
//        $("#circle_time_value").attr("disabled",true);
//     }
//     else{
//         $("#circle_time_value").removeAttr("disabled");
//         $("#single_time_value").val("");
//         $("#single_time_value").attr("disabled",true);
//     } 
// }
function change_user_conf(){
    var nodes = $("#for_jstree").jstree().get_checked(true);
    console.log( nodes );
    var length = nodes.length;
    var array = new Array();
    var str = "";

    for(var i = 0; i < length; i++) {
        if ( nodes[i].type == "user" ) {
            array.push( nodes[i].text );
        }
    }
    if(array.length == 0) {
        message_manager.show_popup_error_mesg("没有明确的用户！");
        return;
    }
    
    for(var i = 0; i < array.length-1; i++) {
        str += array[i] + "，";
    }
    str += array[array.length-1];
    
    $("#SrcUserlist").val(str);
    writeFrame(document.getElementById("SrcUserlist"), array);
    user_group_panel.hide();
   
}

function load_userlist(){
    // user_group_panel.show();
    // user_group_panel.update_info(true);
    var sending_data = {
        ACTION: "load_userlist"
        
    };
    function ondatareceived(data) {

        jstree_render(data);
        user_group_panel.show();;
        

    }
    do_request( sending_data,ondatareceived, function() {
        message_manager.show_popup_error_mesg("暂无用户组数据！");
    } );
}

function enable_selected_items() {
    var checked_items = list_panel.get_checked_items();
    if ( checked_items.length < 1){
        message_manager.show_popup_note_mesg("至少选择一项！");
    }else{
         var checked_items_id = new Array();
        for( var i = 0; i < checked_items.length; i++ ) {
            checked_items_id.push( checked_items[i].id );
        }

        var ids = checked_items_id.join( "&" );
    
        list_panel.enable_item( ids );
    }
   
}

function disable_selected_items() {

    var checked_items = list_panel.get_checked_items();
    if ( checked_items.length < 1){
        message_manager.show_popup_note_mesg("至少选择一项！");
    }else{
        var checked_items_id = new Array();
        for( var i = 0; i < checked_items.length; i++ ) {
            checked_items_id.push( checked_items[i].id );
        }

        var ids = checked_items_id.join( "&" );

        list_panel.disable_item( ids );
    }
}

function delete_selected_items(e) {
    var ids = "";
    if(e.id == "delete_selected"){
        var checked_items = list_panel.get_checked_items();
        var checked_items_id = new Array();
        for( var i = 0; i < checked_items.length; i++ ) {
            checked_items_id.push( checked_items[i].id );
        }
        ids = checked_items_id.join( "&" );
    }else{
        ids = e.value;
    }
    
    list_panel.delete_item( ids );
}

function extend_search_function( element ) {
    list_panel.update_info( true );
}

function create_action_buttons( action_buttons ) {
    var buttons = "";

    if( action_buttons === undefined ) {
        return buttons;/*如果没有定义相应的对象，直接返回*/
    }

    for( var i = 0; i< action_buttons.length; i++ ) {
        var item = action_buttons[i];
        if( item.enable === undefined || !item.enable ){
            continue;
        }
        buttons += '<input type="image" ';
        if( item.id !== undefined && item.id ) {
            buttons += 'id="' + item.id + '" ';
        }
        if( item.value !== undefined && item.value ) {
            buttons += 'value="' + item.value + '" ';
        }
        if( item.name !== undefined && item.name ) {
            buttons += 'name="'+ item.name +'" ';
        }
        if( item.class !== undefined && item.class ) {
            buttons += 'class="action-image ' + item.class + '" ';
        } else {
            buttons += 'class="action-image" ';
        }
        if( item.button_text !==undefined && item.button_text ) {
            buttons += 'title="' + item.button_text + '" ';
        }
        if( item.button_icon !== undefined && item.button_icon ) {
            buttons += 'src="../images/' + item.button_icon +'" ';
        }
        if( item.functions !== undefined && item.functions ) {
            var functions = item.functions;
            for ( var key in functions ) {
                buttons += key +'="' + functions[key] + '" ';
            }
        }
        buttons += '/>';
    }

    return buttons;
}

function read_data(){
// 获取数据
    var sending_data = {
        ACTION: "read_data"
    }

    function ondatareceived( data ) {
        var ipgroups_option_str = '<option value="" disabled selected>请选择源IP组</option>';
        for(var i = 0; i < data.ipgroups_data.length; i++ ){
            ipgroups_option_str += '<option value="'+data.ipgroups_data[i] +'">'+data.ipgroups_data[i]+'</option>';    
        }
        
        $("#ip_group_value").html(''); //html()函数，返回或设置被选元素的内容。这里的目的是初始化ip_group_value的内容为空
        
        $("#ip_group_value").append(ipgroups_option_str);
    
    }

    list_panel.request_for_json( sending_data, ondatareceived );
}

function add_rule( element ) {
    
    read_data();
	$("#protocolType").css("display", "none");
    add_panel.show();
}

//初始化小时和分钟的选项值
function select_options(val){
    var options = [];
    for(var i = 0; i<val; i++){
       var  option ={};
        i = i + "";
        if(i.length<2){
        i = "0"+i;
        }
        else{
        }
        option.value = i;
        option.text = i;
        options.push(option);
    }
    return options;
}


//删除规则函数，包含规则引用检查
function check_delete_rule(item_id){
    //var length_used_rule = [];
    var data_item = list_panel.get_item(item_id);
    //length_used_rule = data_item.rules_for_policy.split("&");
    if( data_item.rules_for_policy != "" ){
        list_panel.operate_item( data_item.id, 'delete_data',
        '策略模板正在被使用。删除该策略模板，也将删除使用该策略模板的规则', true );
    }else{
        list_panel.delete_item(data_item.id);
    }
}

//AJAX异步请求数据
function do_request(sending_data, ondatareceived) {
    $.ajax({
        type: 'POST',
        url: "/cgi-bin/keywordfilter.cgi",
        dataType: "json",
        data: sending_data,
        async: true,
        error: function(request){
            message_manager.show_popup_error_mesg("网络错误,部分功能可能出现异常");
        },
        success: ondatareceived
    });
}

function jstree_render(data) {
    if($("#for_jstree")) {
        $("#for_jstree").remove();
    }
    var div = document.createElement("div");
    div.setAttribute("id","for_jstree");
    var $div = $(div);
    $("#list_panel_id_for_user_group_panel .container-main-body").append($div);
    $("#list_panel_id_for_user_group_panel .container-main-body").css("min-height","200px");
    $("#list_panel_id_for_user_group_panel .container-main-body .rule-list").remove();
    $('#for_jstree').jstree({
        "plugins" : [ 
            "checkbox",
            "state", "types", "wholerow" 
        ],
        "core" : {
            "themes" : { "stripes" : true },
            "data" : data
            
        },
        "types": {
            "user" : {
                
                "icon" : "../images/user.png",
            }
        },
        "checkbox" : {
                "keep_selected_style" : false
        },
    
    });
}
//删除选中规则，包含规则引用检查
function check_delete_selected_items(){
    var checked_items = list_panel.get_checked_items();
    if(checked_items.length < 1){
        message_manager.show_popup_note_mesg("请先选中策略项");
        return;
    }
    var checked_items_id = new Array();
    var ids = "";
    var is_used = "no";
    var used_policy = new Array();
    for(var i=0;i<checked_items.length;i++){
        checked_items_id.push(checked_items[i].id);
        if(checked_items[i].rules_for_policy != ""){
            is_used = "yes";
            used_policy.push(checked_items[i].name);
        }
    }
    ids = checked_items_id.join("&");
    if(is_used == "yes"){
        list_panel.operate_item( ids, 'delete_data',used_policy.join("、")+
        '策略模板正在被使用。删除该策略模板，也将删除使用该策略模板的规则', true );
    }else{
        list_panel.delete_item(ids);
    }
}
//检测协议选项变动来决定是否弹出过滤类型选项
function selectChange(val) {
    var fType = $("input[name='filter_type']:checked").val(); //过滤类型，是关键字还是命令
    console.log(fType);
	if( (fType == "0" ) && ($("#protocol")[0].selectedIndex == 2 || $("#protocol")[0].selectedIndex == 1)) {
		$("#protocolType").css("display", "inline-block"); //如果协议为smtp或者pop3则弹出protocolType框
		$("#tex").prop("checked", true); //邮件正文被自动选择
	}else { //http的情况，不显示protocolType
		$("input[name='protocolType']").prop("checked", false); //prop函数，添加或者返回被选元素的属性值
		$("#protocolType").css("display", "none");
		
	}
    //console.log(val);
    if(cmdList_json[val]){
        //选择了命令，就在cmdlist中添加各类选项
        $("#cmdList").html("").append(createOption(cmdList_json[val]));

    }
}

//过滤类型选项变动改变关键字和命令集
function radioChang(i){
    selectChange($("#protocol").val());
   if(i == 1){ 
    /*命令集
    将表格前面的标题改为“命令类型”
    将标题后面的text中为“关键字”的add-panel-form-item隐藏(整个div)
    将标题为关键字的属性设置为不可见
    显示为“命令”的add-panel-form-item（整个div）
    将命令的id显示
    将protocol中的所有disabled去掉*/
    $("#filter_type_item td:eq(0)").text("命令类型:");
    $("#filter_type_item td:eq(1) div.add-panel-form-item:eq(0)").hide();
    $("#gate").attr("disabled","disabled"); //关键字的id
    $("#filter_type_item td:eq(1) div.add-panel-form-item:eq(1)").show();
    $("#cmdList").removeAttr("disabled");
    //$("#cmdList").val(this.value);
    $("#protocol option").removeAttr("disabled");
         //console.log($("#cmdList").val());
   }else{
    /*关键字集
    将表格前面的标题改为“关键字”
    将标题后面的text中为“命令”的add-panel-form-item隐藏(整个div)
    将标题为命令的属性设置为不可见
    显示为“关键字”的add-panel-form-item（整个div）
    将关键字的id显示
    将protocol中的第三个以后（包括第三个）的option选项设为disabled*/
    $("#filter_type_item td:eq(0)").text("关键字:");
    $("#filter_type_item td:eq(1) div.add-panel-form-item:eq(1)").hide();
    $("#cmdList").attr("disabled","disabled");
    $("#filter_type_item td:eq(1) div.add-panel-form-item:eq(0)").removeAttr("disabled").show();
    $("#gate").removeAttr("disabled");
    $("#protocol option:gt(2)").attr("disabled","disabled");

    
   }
}

//组装options
function createOption(arr){
    var opt = "";
        for(var i = 0; i < arr.length; i++){
            opt +='<option value='+arr[i].value+'>'+arr[i].text+'</option>';
        }
        return opt;
}

function writeFrame(e, array) {

    if(array.length < 4) {
        clearFrame(e);
        return;
    }
    var ul$ = $(e).next().children("ul");
    ul$.html("");
    for(var i=0; i<array.length && i<15; i++) {
        ul$.append("<li>"+array[i]+"</li>");
    }
    if(array.length > 15) {
        ul$.append("<li>...</li>");
    }
    susFrame(e);
}
function clearFrame(e) {

    $(e).removeClass("displayPro");

}
function susFrame(e) {

    $(e).addClass("displayPro");

}

function write_lib_data(panel, textId) {
    var checked_items = panel.get_checked_items();
    var dataText = new Object();
    dataText.SrcIPGroup = "请选择至少一组源IP组！";
    dataText.DestIPGroup = "请选择至少一组目标IP组！";
    dataText.ServiceName = "请选择至少一种服务";
    var str = "";
    var array = new Array();
    var length = checked_items.length;
    if (checked_items.length == 0) {
        message_manager.show_popup_error_mesg(dataText[textId]);
        return;
    } else {
        for (var i = 0; i < length - 1; i++) {
            str += checked_items[i].name + "，";
            array.push(checked_items[i].name);
        }
        str += checked_items[length - 1].name;
        array.push(checked_items[length - 1].name);
        $("#" + textId).val(str);
        writeFrame(document.getElementById(textId), array);
        panel.hide();
    }
}

function select_items(e, id) {
    var ip_or_user_module = {
        'sour_ip': '#SrcIPGroup,#SrcIPGroup_btn',
        'sour_user': '#SrcUserlist,#SrcUserlist_btn',
        'sour_netip': '#sour_netip_text',
        'sour_mac': '#sour_mac_text'
    };
    var dest_ipgroup_module = {
        'dest_ip': '#DestIPGroup,#ipGroup',
        'dest_group': '#dest_ip_text'
    };
    var service_app_module = {
        'service': '#ServiceName,#ServiceName_btn',
        'app': '#Appname,#Appid_btn'
    }
    var time_plan_module = {
        'single_plan': '#singletime',
        'circle_plan': '#looptime'
    }
    var select_obj = {
        'ip_or_user': ip_or_user_module,
        'dest_ipgroup': dest_ipgroup_module,
        'service_app': service_app_module,
        'time_plan': time_plan_module
    };
    var all_module = {};
    for (var k in select_obj) {
        if (id == k) {
            all_module = select_obj[k];
        }
    }
    for (var k in all_module) {
        if (k == e) {
            $(all_module[k]).show().removeAttr('disabled').parent().show();
        } else {
            $(all_module[k]).hide().attr('disabled', 'disabled').parent().hide();
        }
    }

}

//为所有配置按钮初始化样式
function set_button() {

    $(".set-button").addClass("add-panel-form-button").removeClass("add-panel-form-disabled-button");
}

//配置按钮弹出配置模版事件
function add_configure_rule(e) {
    //修改部分
    e.update_info(true);
    var panel_body_id = e.panel_body_id;
    var panel_name = e.panel_name;
    var panel_text = panel_name.replace(/\_panel/,'');
    var panel_text_no_space = $('#'+panel_text).val().replace(/\ /g,'');
    var panel_text_arr ;
    if (/\,/.test(panel_text_no_space)) {
        panel_text_arr = panel_text_no_space.split(',');
    }else{
        panel_text_arr = panel_text_no_space.split('，');
    }

    $('#'+panel_body_id+' tr').each(function(index, el) {
        if ($.inArray($(this).children('td').eq(1).text(),panel_text_arr) != -1) {
            $(this).children('td').eq(0).children('input').attr('checked',true);
            for (var i = 0; i < e.detail_data.length; i++) {
                        e.detail_data[index].checked = true;
                    }
        } 
    });
    e.show();
}

function cancel_user_conf(){
    //PT:将temp还原
    object_selected_temp = object_selected;
    object_selected_name_temp = object_selected_names;
    user_group_panel.hide();
    $("#SrcUserlist").val(object_selected_names.join(","));
    // console.log(object_selected_names);
}