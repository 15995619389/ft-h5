import Vue from "vue";
import scroller from "vue-scroller";
import { GetIdFromUrl } from "../../modules/UrlService";
import * as client from "../../modules/ApiClient";
import * as StorageService from "../../modules/StorageService";

function refreshDone(){

}

var vm = new Vue({
    el:"#container",
    components: {
        scroller: scroller.Scroller
    },
    data:{
        panentDetail:[],
        datamodel:{
            pageIndex:1,
            pageSize:10,
            status:0
        },
        loading:true,
        Nodata:false
    },
    methods:{
        Get:function(fn){
            var self = this;
            var data = self.$data;
            client.Request({
                url:'/tech/tradepatentmanage',
                type:'get',
                data:this.$data.datamodel,
                success:function(result){                                      
                     if(result && result.Code =="200"){                                               
                         
                             if(typeof fn =="function"){
                                 fn(result);
                             }else{                           
                                 data.panentDetail = result.Data;                           
                             };
                    }              
                },
                error:function(err){
                },
                complete:function(){
                },
            });
        },
        Refresh:function(bone){
            if(bone){
                refreshDone = bone;
            }
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2FPatent%2FButtJointPanent';
                return;
            }
            var data = this.$data;
            data.loading = true;
            data.datamodel.pageIndex = 1;              
            setTimeout(function () {
                client.Request({
                    url:'/tech/tradepatentmanage',
                    type:'get',
                    data:data.datamodel,
                    success:function(result){  
                        if(result && result.Code =="200"){                                               
                            if(typeof fn =="function"){
                                fn(result);
                            }else{
                                data.panentDetail = [];
                                if(data.panentDetail.length==0){
                                    data.loading = false;
                                    if(data.datamodel.status==0){
                                        data.Nodata = true;
                                    }
                                }
                                for(var i = 0;i<result.Data.length;i++){
                                    result.Data[i].isShow = false;
                                    data.panentDetail.push(result.Data[i]);
                                }
                            };
                        }              
                    },
                    error:function(err){
                    },
                    complete:function(){
                        refreshDone();
                    },
                });
            }, 500);
        },
        Append:function(bone){
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2FPatent%2FButtJointPanent';
                return;
            }
            var self = this;
            var data = self.$data; 
            if(this.panentDetail.length==0){
                data.datamodel.pageIndex=1;
            }else{
                data.datamodel.pageIndex++;
            }
            setTimeout(function () {
                self.Get(function(result){
                    var ismore = true;
                    for (var i = 0; i < result.Data.length; i++) {                        
                        data.panentDetail.push(result.Data[i]);
                    }
                    if(data.panentDetail.length==0){
                        data.loading = false;
                        if(data.datamodel.status==0){
                            data.Nodata = true;
                        }
                    }
                    if (result.data && result.data.length > 0)
                        ismore = false;
                    if(ismore){
                        data.loading = false;
                    }
                    bone(ismore);
                });
            }, 500);
        },
        Show: function (i) {
            var self = this;
            self.$data.datamodel.status = i;
            this.$refs.scroller.scrollTo(0, 0);
            this.$refs.scroller.triggerPullToRefresh();           
        },
        Detail:function(patent){  
           
            window.location.href='/patent/details/'+patent.PatentId;
        },

        
    }
});
