import Vue from "vue";
import * as client from "../../modules/ApiClient";
import {GetIdFromUrl} from "../../modules/UrlService";
import * as StorageService from "../../modules/StorageService";
import foot from "../../components/foot-nav/foot-nav.vue";
import scroller from "vue-scroller";

function searchDone(){
    return;
}

function appendDone(){
    return;
}

var vm = new Vue({
    components:{
        scroller:scroller.Scroller,
        foot
    },
    el:"#container",
    data:{
        tabs:[],
        param:{ search: "", type: 6, page: 0, pageSize: 10 }
    },
    methods:{
        Search:function(done){
            searchDone = done;
            this.$data.param.page = 1;
            this.Get(function(success,res){
                if(success){
                    vm.$data.tabs=res.Entitys;
                }
                if(searchDone){
                    searchDone();
                }
            });
        },
        Append:function(done){
            appendDone = done;
            this.$data.param.page +=1;
            this.Get(function(success,res){
                if (success) {
                    var list = res.Entitys;
                    if (list.length){
                        for (var i = 0; i < list.length; i++) {
                            vm.$data.tabs.push(list[i]);
                        }
                        appendDone();
                    }else{
                        appendDone(true);
                    }
                }else{
                    appendDone();
                }
            });
        },
        Detail:function(id){
            location.href = "/news/detail/" + id;
        },
        Get:function(callback){
            client.Request({
                type: 'get',
                url: client.Api.newsindex,
                data: this.$data.param,
                success: function (res) {
                    callback(true,res);
                },
                error:function(res){
                    callback(false)
                }
            });
        }
    },
    filters:{
        t1:function(value){
            if (value != null&&value!="") {
                return value.length > 8 ? value.substring(0, 8) + "..." : value;
            }
        },
        srce:function(value){
            if (value != null&&value!="") {
                return value.length > 4 ? value.substring(0, 4) : value;
            }
        },
        formatDate:function(value){
            if (value != null&&value!="") {
                return value.substring(0,10);
            }
        }
    }
});