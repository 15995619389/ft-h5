import Vue from "vue";
import { GetParamUrl } from "../../modules/UrlService";
import * as client from "../../modules/ApiClient";
import { Popup,Toast,Indicator,MessageBox } from "mint-ui";


var vm = new Vue({
    el:"#container",
    data:{
        good:{},
        isSub:true
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        if(!GetParamUrl("gdId")){
            window.location.href = '/seller/good'
            return
        }
        this.$data.good.Id=GetParamUrl("gdId")
    },
    mounted:function(){
        Indicator.open('加载中...')
        var self=this;
        client.Request({
            url:'/highs/myarticledetail/'+ self.$data.good.Id,
            type:'GET',
            success:function(res){
                if(res&&res.Code == "200"){
                    self.$data.good=res.Data
                }
            },
            complete: function () {
                Indicator.close()
            }
        });
    },
    methods:{

    }
})