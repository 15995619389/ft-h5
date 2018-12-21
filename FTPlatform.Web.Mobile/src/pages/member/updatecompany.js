import * as client from "../../modules/ApiClient";
import Vue from "vue";
import {Toast} from "mint-ui";

function convertArray(o) {
    var v = {};
    for (var i in o) {
        if (o[i].name != '__VIEWSTATE') {
            if (typeof (v[o[i].name]) == 'undefined')
                v[o[i].name] = o[i].value;
            else
                v[o[i].name] += "," + o[i].value;
        }
    }
    return v;
}
var My =new Vue({
            el: '.mui-content',
            data: {
                user: {},
                company: {}
            },
            created:function(){
                this.initData();
            },
            methods: {
                initData: function () {
                    var data = this.$data;
                     client.Request({
                        type: "post",
                        url:  client.Api.basicInfo,
                        success: function (result) {
                            data.user = result.user;
                            data.company = result.user.UserCompany;
                            if (data.company != null)
                            {
                                $('#Name').val(data.company.Name);
                                $('#RegisterCapital').val(data.company.RegisterCapital);
                                $('#Address').val(data.company.Address);
                                $('#Position').val(data.user.Position);
                                if (data.company.RegisterTime != null) {                                  
                                    $('#RegisterTime').val(data.company.RegisterTime.substring(0,10));
                                }
                            }
                   
                        }, complete: function (XMLHttpRequest, textStatus) {
                        }
                    });
                },
                submit: function () {
                    var self = this;
                    if (self.IsNull($('#Name').val()))
                    {
                        Toast({message:"请输入企业名称",duration:1000})
                        return;
                    }
                    if (self.IsNull($('#RegisterCapital').val())) {
                        Toast({message:"请填写注册资金",duration:1000});
                        return;
                    }
                    if (self.IsNull($('#Address').val())) {
                        Toast({message:"请填写企业地址",duration:1000});
                        return;
                    }
                    var reg = new RegExp("(^[0-9]+(.[0-9]{1,2})?$)|(^[1-9]+[0-9]*$)");
                    if (!reg.test($('#RegisterCapital').val()) || $('#RegisterCapital').val()<=0) {
                        Toast({message:"注册资金为大于零小数点后最多两位的数字",duration:1000});
                        return;
                    }
                    if ($('#RegisterCapital').val().indexOf('.') != -1)
                    {
                        if($('#RegisterCapital').val().length>18)
                        {
                            Toast({message:"注册资金超过最大限制",duration:1000});
                            return;
                        }
                    }
                    else  if($('#RegisterCapital').val().length>15)
                    {
                        Toast({message:"注册资金超过最大限制",duration:1000});
                        return;
                    }       
                    var s = $('#RegisterTime').val();
                    var d = new Date(Date.parse(s.replace(/-/g, "/")));
                    var curDate = new Date();
                    if (d > curDate) {
                        Toast({message:"注册时间不能大于今天",duration:1000})
                        return;
                    }
                    var fromdata = $("form").serializeArray();
                    fromdata = convertArray(fromdata);
                     client.Request({
                        type: "post",
                        data: fromdata,
                        url:  client.Api.applycompany,
                        success: function (result) {
                            if (result.Flag)
                                location.href = '/mybusiness/companyinfo';
                            else
                                Toast({message:result.Message,duration:1000});
                        }, complete: function (XMLHttpRequest, textStatus) {
                        }
                    });
                },
                Check:function() {
                    var myDate = new Date();
                    var s = $('#RegisterTime').val();
                    var d = new Date(Date.parse(s.replace(/-/g, "/")));
                    var curDate = new Date();
                    if (d > curDate) {
                        Toast({message:"注册时间不能大于今天",duration:1000})
                        $('#RegisterTime').focus();
                        $('#RegisterTime').click();
           
                    }
                },
                IsNull: function (data) {
                    return data == undefined || data == null || data + "" == "" || ("" + data).replace(/(^\s*)|(\s*$)/g, "") == "";
                },
            },
        });