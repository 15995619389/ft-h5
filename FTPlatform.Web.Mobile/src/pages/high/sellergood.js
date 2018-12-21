import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import scroller from "vue-scroller";
import {  Toast,MessageBox,Indicator } from 'mint-ui'



var vm = new Vue({
    el: '#container',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        goods:[],
        param:{pageIndex:1,auditState:99,articleState:99},
        SortPanel:0,
        loading: false,
        paddingTop: 40,
        isSub:true,
        notPassId:0
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
    },
    methods: {
        Get: function(callback) {
            client.Request({
                type: "GET",
                url: "/highs/myarticlelist",
                data: this.$data.param,
                success: function(res) {
                    callback(true, res);
                },
                error: function(res) {
                    callback(false, null);
                }
            });
        },
        Search:function(done){
            var _self = this;
            if(done){
                Indicator.open('加载中...')
            }
            _self.$data.loading = true;
            _self.$data.param.pageIndex = 1;
            _self.Get(function(success, res) {
                if (success&&res.Code=="200") {
                    _self.$data.goods = res.Data || [];
                }
                if(done){
                    Indicator.close()
                }
                _self.$data.loading = false;
                if (done) {
                    done();
                }
            });
        },
        Append:function(done){
            var _self = this;
            if (this.CheckLoading()) {
                done();
                return;
            }
            var ismore = false;
            if (this.$data.goods.length) {
                _self.$data.param.pageIndex += 1;
            } else {
                this.$data.param.pageIndex = 1;
            }
            this.Get(function(success, res) {
                if (success&&res.Code=="200") {
                    var list = res.Data || [];
                    if (list.length) {
                        for (var i = 0; i < list.length; i++) {
                            _self.$data.goods.push(list[i]);
                        }
                    } else {
                        ismore = true;
                    }
                }
                if (res == null) {
                    ismore = true;
                }
                done(ismore);
            });
        },
        CheckLoading: function() {
            var self = this;
            if (this.$data.loading) {
                setTimeout(function() {
                    self.CheckLoading();
                }, 2000);
            } else {
                return false;
            }
        },
        SortPanelShow:function(status){
            var self=this
            if((self.$data.SortPanel==1&&status==1)||(self.$data.SortPanel==2&&status==2)){
                self.$data.paddingTop=40
                self.$data.SortPanel=0
            }
            else{
                self.$data.paddingTop=70
                self.$data.SortPanel=status
            }
        },
        AuditStateSort:function(status){
            this.$data.param.auditState=status
            this.$data.SortPanel=0
            this.$data.paddingTop=40
            this.$refs.scroller.scrollTo(0, 0);
            this.$refs.scroller.triggerPullToRefresh();
        },
        ArticleStateSort:function(status){
            this.$data.param.articleState=status
            this.$data.SortPanel=0
            this.$data.paddingTop=40
            this.$refs.scroller.scrollTo(0, 0);
            this.$refs.scroller.triggerPullToRefresh();
        },
        Operation:function(type,productid){
            var self=this
            if(!client.IsLogin()){
                window.location.href = client.LoginReturn(window.location.href)
                return
            }
            if(!self.$data.isSub){
                return
            }
            if(type==1){
                self.$data.isSub=false
                client.Request({
                    url:'/highs/myarticleoperate/'+productid+'/1',
                    type:'POST',
                    success:function(result){
                        Toast({ message:result.Message, duration: 1000 })
                    },
                    complete: function () {
                        self.$data.isSub=true
                        self.Search()
                    }
                });
            }
            else if(type==2){
                self.$data.isSub=false
                client.Request({
                    url:'/highs/myarticleoperate/'+productid+'/2',
                    type:'POST',
                    success:function(result){
                        Toast({ message:result.Message, duration: 1000 })
                    },
                    complete: function () {
                        self.$data.isSub=true
                        self.Search()
                    }
                });
            }
            else if(type==3){
                MessageBox.confirm('删除后将无法找回该商品。','是否确认要删除该商品？').then(action => {
                    if (action == 'confirm') {
                        self.$data.isSub=false
                        client.Request({
                            url:'/highs/myarticleoperate/'+productid+'/3',
                            type:'POST',
                            success:function(result){
                                Toast({ message:result.Message, duration: 1000 })
                            },
                            complete: function () {
                                self.$data.isSub=true
                                self.Search()
                            }
                        });
                    }
                }).catch(err => { });
            }
            else if(type==4){
                window.location.href="/seller/publishgood/"+productid
            }
        },
        NotPassPanel:function(productId){
            var self=this;
            if(self.notPassId==productId)
                self.$data.notPassId=0
            else
                self.$data.notPassId=productId
        }
    }
})