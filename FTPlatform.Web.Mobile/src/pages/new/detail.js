import * as StorageService from "../../modules/StorageService";
import Vue from "vue";
import * as client from "../../modules/ApiClient";
import { GetIdFromUrl } from "../../modules/UrlService";

var vm = new Vue({
    el: '#container',
    data: {
        tabs: {},
        preId: "",
        nextId: "",
    },
    created: function () {
        this.Init();
    },
    methods: {
        Init:function(){
            var _fil = this;
            client.Request({
                type: 'get',
                url: client.Api.newsdetail,
                data: { Id: GetIdFromUrl() },
                success: function (data) {
                    if(data.Flag){
                        _fil.tabs = data.GetNew;
                        _fil.preId = data.preId;
                        _fil.nextId = data.nextId;
                        if(!data.IsShowPage){
                            $("#ShowBotton").show();
                        }
                    }else {
                        location.href="/news/index";
                    }
                },
                complete: function () {

                }
            })
        },
        UpRoDownSheet: function (Vindex, type) {
            location.href = Vindex;
        }
    },
    filters: {
        formatDate: function (value) {
            if (value != null && value != "") {             
                return value.replace("T"," ").substr(0,16);
            }
        }
    }
})