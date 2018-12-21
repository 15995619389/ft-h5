import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import Vue from "vue";
import {Toast,MessageBox} from "mint-ui";
import catePicker from '../../components/category-picker/category-picker.vue';

var Bus = new Vue({
    el: '.mui-content',
    components: {
        categoryPicker: catePicker
    },
    data: {
        businesscategory:[],         //行业标签
        isUpdate:false
    },
    created: function () {
        if (!client.GetCurrentUser()) {
            window.location.href = client.LoginReturn(location.href);
            return;
        }
        this.initData();
    },
    mounted: function () {
        var self = this;
        self.$refs.catepicker.Init({
            CallBack: function (arr) {
                self.UpdateCategory(arr);
            },
            HasBottom: false,
            Auto:true
        });
    },
    methods: {
        initData: function () {
            var self = this;
            client.Request({
                type: "GET",
                url:"/my/businesscategory",
                success: function (result) {
                    if(result.err_code=="0000"){
                        $(result.data).each(function(i){
                            var cate={};
                            cate.Type=this.Type;
                            cate.TypeNum=0;
                            cate.BusinessClassLevel1=this.BusinessClassLevel1;
                            cate.BusinessClassLevelName1=this.BusinessClassLevelName1;
                            cate.BusinessClassLevel2=this.BusinessClassLevel2;
                            cate.BusinessClassLevelName2=this.BusinessClassLevelName2;
                            cate.BusinessClassLevel3=this.BusinessClassLevel3;
                            cate.BusinessClassLevelName3=this.BusinessClassLevelName3;
                            self.$data.businesscategory.push(cate);
                        });
                    }
                }
            });
        },
        UpdateCategory: function (arr) {
            var self = this;
            if(arr.length<=0){
                return;
            }
            var BusinessNewCategory = {
                Type: 1,
                TypeNum: 0,
                BusinessClassLevel1: null,
                BusinessClassLevelName1: null,
                BusinessClassLevel2: null,
                BusinessClassLevelName2: null,
                BusinessClassLevel3: null,
                BusinessClassLevelName3: null
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].Id) {
                    BusinessNewCategory['BusinessClassLevel' + arr[i].Level] = arr[i].Id;
                    BusinessNewCategory['BusinessClassLevelName' + arr[i].Level] = arr[i].Name;
                }
            }
            var isResult=false;
            $(self.$data.businesscategory).each(function(i){
                if(this.BusinessClassLevel1==BusinessNewCategory.BusinessClassLevel1&&this.BusinessClassLevel2==BusinessNewCategory.BusinessClassLevel2
                    &&this.BusinessClassLevel3==BusinessNewCategory.BusinessClassLevel3){
                    isResult=true;
                }
            });
            if(!isResult){
                self.$data.businesscategory.push(BusinessNewCategory);
                self.$data.isUpdate=true;
            }else{
                Toast({message:"不能添加重复的标签",duration:1000});
            }
        },
        PickCategory: function () {
            if(this.$data.businesscategory.length==3){
                Toast({message:"最多可添加三个行业标签",duration:1000});
                return;
            }
            this.$refs.catepicker.Show();
        },
        Submit: function () {
            var isSubmit=true;
            if(!this.$data.isUpdate){
                location.href = '/mybusiness/basicinformation';
                return;
            }
            var jsoncate=this.$data.businesscategory;
            if(jsoncate.length<=0){
                Toast({message:"请至少选择一项涉及行业",duration:1000});
                return;
            }
            $(jsoncate).each(function(i){
                this.TypeNum=i+1;
            });
            if(!isSubmit){
                return;
            }
            client.Request({
                type: "post",
                data: {
                    type: 4,
                    content: JSON.stringify(jsoncate)
                },
                url: client.Api.updateinfo,
                success: function (result) {
                    if (result.Flag){
                        var user=client.GetCurrentUser();
                        if(user.IsSupply){
                            MessageBox({
                                title: '提示',
                                message:result.Message
                            }).then(action=>{
                                location.href = '/mybusiness/basicinformation';
                            });
                        }else{
                            location.href = '/mybusiness/basicinformation';
                        }
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    isSubmit=true;
                }
            })
        },
        Del: function (index) {
            var data = this.$data;
            data.businesscategory.splice(index, 1);
            this.$data.isUpdate=true;
        }
    }
});