import imageUploader from '../../components/image-uploader/image-uploader.vue'
import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import scroller from "vue-scroller"
import {  Toast,Indicator } from 'mint-ui'
import { GetIdFromUrl } from "../../modules/UrlService"
/*--header位置--*/
$(function () {
    $('input[type="text"],textarea')
        .bind('click', function () {
            $('header').css('position', 'absolute')
        })
        .bind('blur', function () {
            $('header').css('position', 'fixed')
        })
})


var vm = new Vue({
    el: '#container',
    components: {
        imageUploader
    },
    data:{
        good:{SalePrice:"",ApplicationArea:"",ArticleImgList:[]},
        IsCheckBox:false,
        backGroundObject:{
            background:"#fff"
        },
        domain: '',
        goodDescription:"",
        isSub:true
    },
    created:function(){
        var darr = $('#ApiUrl').val().split('/')
        this.$data.domain = darr.slice(0, darr.length - 1).join('/')
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        if (!client.GetCurrentUser()) {
            window.location.href = "/seller/good";
            return
        }
    },
    mounted: function () {
        var self = this
        var id=GetIdFromUrl()
        if(id){
            client.Request({
                url: '/highs/myarticledetail/' + id,
                type: 'GET',
                success: function (res) {
                    if(res.Code=="200"){
                        self.$data.good=res.Data
                        if(res.Data.SalePrice==''||res.Data.SalePrice=='0.00'){
                            res.Data.SalePrice=''
                            self.$data.IsCheckBox=true
                            self.$data.backGroundObject.background="#ddd"
                        }
                        self.$data.goodDescription = client.ConvertHtmlToText(self.$data.good.Description)
                    }else{
                        Toast({ message: res.Message, duration: 1000 })
                    }
                },
                complete: function () {
                    self.InitComponents()
                }
            })
        }else{
            self.InitComponents()
        }
    },
    methods: {
        InitComponents: function () {
            var self=this
            self.$refs.uploader.Init({
                CallBack: function (res) {
                    if(res.err_code=="200"){
                        self.$data.good.ArticleImgList.push({ ImgPath: res.data })
                    }else{
                        Toast({ message: res.err_msg, duration: 2000 })
                    }
                },
                Action: '/common/uploadimage',
                ModuleName:"/High/Article/"
            })
        },
        ChangeCheckBox:function(){
            var self=this
            self.$data.good.SalePrice=""
            if(self.$data.IsCheckBox){
                self.$data.backGroundObject.background="#ddd"
            }else{
                self.$data.backGroundObject.background="#fff"
            }
        },
        UploadImage:function(){
            this.$refs.uploader.Show()
        },
        RemoveImage: function (index) {
            this.$data.good.ArticleImgList.splice(index, 1)
        },
        Validate: function () {
            var model=this.$data.good
            var r = /^\+?[1-9][0-9]*$/
            var r1=/^\d+(\.\d+)?$/
            var isPas = true
            if(!model.Name){
                Toast({ message: '商品名称不能为空', duration: 1000 })
                isPas=false
            }
            else if(model.Name.length>200){
                Toast({ message: '商品名称不能大于200个字', duration: 1000 })
                isPas=false
            }
            else if(!model.ApplicationArea||model.ApplicationArea==""){
                Toast({ message: '请选择应用领域', duration: 1000 })
                isPas=false
            }
            else if(model.ArticleImgList.length<1){
                Toast({ message: '至少上传一张商品图片', duration: 1000 })
                isPas=false
            }
            else if(!model.Introduction){
                Toast({ message: '产品概述不能为空', duration: 1000 })
                isPas=false
            }
            else if(model.Introduction.length>1000){
                Toast({ message: '产品概述不能大于1000个字', duration: 1000 })
                isPas=false
            }
            else if(!this.$data.goodDescription){
                Toast({ message: '产品说明不能为空', duration: 1000 })
                isPas=false
            }
            else if(this.$data.goodDescription.length>1000){
                Toast({ message: '产品说明不能大于1000个字', duration: 1000 })
                isPas=false
            }
            else if(model.Remark&&model.Remark.length>1000){
                Toast({ message: '备注不能大于1000个字', duration: 1000 })
                isPas=false
            }
            else if(!model.MeasureUnit){
                Toast({ message: '计量单位不能为空', duration: 1000 })
                isPas=false
            }
            else if(model.MeasureUnit.length>50){
                Toast({ message: '计量单位不能大于50个字', duration: 1000 })
                isPas=false
            }
            else if(r.test(model.MeasureUnit)){
                Toast({ message: '计量单位格式不正确', duration: 1000 })
                isPas=false
            }
            else if(!model.OrderQuantity){
                Toast({ message: '起订量不能为空', duration: 1000 })
                isPas=false
            }
            else if(!r.test(model.OrderQuantity)){
                Toast({ message: '起订量格式不正确', duration: 1000 })
                isPas=false
            }
            else if(!this.$data.IsCheckBox&&!model.SalePrice){
                Toast({ message: '销售价格不能为空', duration: 1000 })
                isPas=false
            }
            else if(!this.$data.IsCheckBox&&!r1.test(model.SalePrice)){
                Toast({ message: '销售价格格式不正确', duration: 1000 })
                isPas=false
            }
            return isPas
        },
        PostGood:function(){
            var self = this
            if (self.Validate()&&self.$data.isSub) {

                self.$data.isSub=false
                Indicator.open('提交中,请稍等...')

                var data = {}
                $.extend(data, self.$data.good)
                data.Description = client.ConvertTextToHtml(self.goodDescription)
                data.ImgUrl=data.ArticleImgList[0].ImgPath

                client.Request({
                    type: 'post',
                    url: '/highs/releasearticle',
                    data: data,
                    success: function (res) {
                        $(".submint_success").show()
                        $(".publishGood").hide()
                        if(res.Code!="200"){
                            $(".submint_success #imgUrl")[0].src='/Content/image/error.png'
                            $(".submint_success .mui-title").html("提交失败")
                            $(".submint_success #messgeinfo").html(res.Message)
                        }
                    },
                    complete: function (result) {
                        self.$data.isSub=true;
                        Indicator.close();
                    },
                });
            }
        },
        SkipPublish:function(){
            window.location.href="/seller/publishgood"
        }
    }
})