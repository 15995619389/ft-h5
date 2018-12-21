import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import {
    GetIdFromUrl,
    GetParamUrl
} from '../../modules/UrlService'
import {
    Toast,
    DatetimePicker
} from 'mint-ui'

Vue.component(DatetimePicker.name, DatetimePicker)

new Vue({
    el: '.mui-content',
    created: function () {
        this.$data.apply.DemandId = GetIdFromUrl()
        this.$data.istech = GetParamUrl('istech');
    },
    data: {
        apply: {
            DemandId: '',
            StartTime: new Date(),
            EndTime: new Date(),
            Solution: ''
        },
        istech:true,
    },
    computed: {
        CurrentDate: function () {
            return new Date()
        },
        StartDate: function () {
            return this.apply.StartTime
        },
        EndDate: function () {
            return this.apply.EndTime
        }
    },
    methods: {
        Submit: function () {
            if (this.$data.apply.Solution == '') {
                Toast({
                    message: '请填写大致解决方法！',
                    duration: 1000
                })
                return
            }
            if (this.$data.apply.Solution.length > 450) {
                Toast({
                    message: '解决方法超出字数限制！',
                    duration: 1000
                })
                return
            }
            if (this.$data.apply.StartTime == null) {
                Toast({
                    message: '请输入方便联系时间！',
                    duration: 1000
                })
                return
            }
            if (this.$data.apply.EndTime == null) {
                Toast({
                    message: '请输入方便联系时间！',
                    duration: 1000
                })
                return
            }
            var self = this;
            client.Request({
                type: 'post',
                data: this.$data.apply,
                url: '/demands/' + this.$data.apply.DemandId + '/solve',
                success: function (res) {
                    if (res.err_code == '200') {
                        window.location.href = '/demand/solvesuccess?istech=' + self.$data.istech;
                    }
                    if (res.err_code == '401') {
                        window.location.href = '/passport/login'
                    }
                    if (res.err_code == '400' && res.err_msg == 'SELF') {
                        Toast({
                            message: '无法申请解决自己的需求！',
                            duration: 1000
                        })
                    }
                }
            })
        },
        GetSartTime: function () {
            this.$refs.startPicker.open()
        },
        GetEndTime: function () {
            this.$refs.endPicker.open()
        }
    },
    filters: {
        FormatDate: function (date) {
            if (date) {
                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            }
            return ''
        }
    }
})
