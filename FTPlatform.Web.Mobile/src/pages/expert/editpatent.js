var Supplier = Class.extend({
    init: function () {
        this.initVue();
        this.initData();
    },
    initVue: function () {
        this.vue = new Vue({
            el: '.mui-content',
            data: {
                Patent: {}
            },
            methods: {
                Submit: $.proxy(this._submit, this),
                Check:$.proxy(this._check,this)
            }
        })
    },
    initData: function () {
        var data = this.vue.$data;
       var index= layer.msg("正在加载...", { time: 20000 });
        $.take({
            type: "post",
            url: $.api.supplierdetail,
            success: function (result) {
                for (var i = 0; i < result.PatentedList.length; i++)
                    if (result.PatentedList[i].Id == $('#id').val())
                        data.Patent = result.PatentedList[i];
            },
            complete: function (XMLHttpRequest, textStatus) {
                layer.close(index);
            }
        })
    },
    _check: function () {
        var myDate = new Date();
        var s = $('#ParentedMakeTime').val();
        var d = new Date(Date.parse(s.replace(/-/g, "/")));
        var curDate = new Date();
        if (d > curDate) {
            layer.msg("申请日期不能大于今天")
            $('#ParentedMakeTime').focus();
            $('#ParentedMakeTime').click();

        }
    },
    IsNull: function (data) {
        return data == undefined || data == null || data + "" == "" || ("" + data).replace(/(^\s*)|(\s*$)/g, "") == "";
    },
    _submit: function () {       
        var s = $('#ParentedMakeTime').val();
        var d = new Date(Date.parse(s.replace(/-/g, "/")));
        var curDate = new Date();
        if (d > curDate) {
            layer.msg("申请日期不能大于今天")
            return;
        }
        if (this.IsNull(s))
        {
            layer.msg("请选择申请日期");
            return;
        }
        $.take({
            type: "post",
            data: { Id: $('#id').val(), ParentedName: $('#ParentedName').val(), ParentedRemark: $('#ParentedRemark').val(), ParentedHaveName: $('#ParentedHaveName').val(), ParentedMakeTime:$("#ParentedMakeTime").val() },
            url: $.api.updatepatent,
            success: function (result) {
                if (result.Flag)
                    location.href = '/expert/supplierdetail';
                else
                    layer.msg(result.Message);
            },
            error: function (result) {
                layer.msg(result.Message);
            }
        })
    }
})
$(function () {
    var s = new Supplier();
    
})