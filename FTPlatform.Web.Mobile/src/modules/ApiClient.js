(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ApiClient', ['./StorageService', './FilterService', 'jquery'], factory)
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('./StorageService'),
            require('./FilterService'),
            require('jquery')
        )
    } else {
        root.ApiClient = factory(root.StorageService, root.FilterService, root.jQuery)
    }
})(this, function (StorageService, FilterService, $) {
    'use strict'
    var Api = {
        domain: $('#ApiUrl').val() || 'http://localhost:8000/api',
        apioauth: '/token',
        apicorsauth: '/token/',
        apicorsrerefresh: '/token/refresh',
        configs: '/apidemo/getconfigs',
        homeindex: '/configs/homepage', // 首页
        techshare: '/tech/', // 技术推荐首页
        techdetail: '/tech/{id}', // 技术详情
        applytech: '/tech/apply', // 申请技术应用
        consult: '/tech/consult', // 技术咨询
        getnav: '/configs/getnavs',
        getnavforindex: '/configs/getnavsforindex',
        getbanner: '/configs/getbanners',
        getdemand: '/demands/demandspage', // 需求首页
        demandislogin: '/demands/islogin', // denglu
        demanddetail: '/demands/demanddetail', // 需求详情
        publishdemand: '/demands/publishdemand', // 我的需求
        submitdemand: '/demands/submitdemand', // 提交需求
        opttermination: '/demands/opttermination', // 确认、拒绝终止
        deletedemand: '/demands/demanddel', // 删除需求
        termination: '/demands/termination', // 申请终止
        verifypayment: '/demands/verifypayment', // 确认付款
        critique: '/demands/critique', // 需求评价
        finishcritique: '/demands/finishcritique', // 提交评价
        basicInfo: '/my/info', // 个人信息
        updateinfo: '/my/updateinfo', // 修改个人信息
        uploadimg: '/my/uploadimg', // 上传头像
        editusername: '/my/editusername', // 修改用户名
        getbuscategory: '/my/getbuscategory', // 获取业务分类
        bindemail: '/my/bindemail', // 绑定邮箱
        carte: '/my/carte', // 我的名片首页列表
        cartereceive: '/my/cartereceive', // 接收名片
        cartereject: '/my/cartereject', // 拒收名片
        cartedelete: '/my/cartedelete', // 删除名片
        mycarte: '/my/mycarte', // 我的名片信息
        updatemycarte: '/my/updatemycarte', // 修改名片信息
        usermessage: '/my/usermessage', // 用户消息
        myattention: '/my/myattention', // 我的关注
        applycompany: '/my/applycompany', // 修改或申请企业用户
        supplierapply: '/expert/supplierapply', // 申请供方判断
        applysupplier: '/expert/applysupplier', // 个人申请供方
        applysupplierdept: '/expert/applysupplierdept', // 机构申请供方
        supplierdetail: '/expert/supplierdetail', // 供方资料
        updatesupplier: '/expert/updatesupplier', // 编辑供方擅长领域和个人简介
        updatepatent: '/expert/updatepatent', // 编辑专利信息
        expertunfollow: '/expert/unfollow', // 取消专家关注
        critiqueDU: '/expert/critique', // 评价需方
        finishcritiqueDU: '/expert/finishcritique', // 提交评价
        myindex: '/my/index', // 个人中心
        sendcode: '/my/sendcode', // 发送验证码
        releaseTechnology: '/tech/releasetechnology', // 发布技术管理
        submitreleasetech: '/tech/tsubmit', // 提交
        deletereleasetech: '/tech/techdel', // 删除发布技术
        sbutment: '/tech/sbutment', // 对接技术管理
        myadvise: '/tech/techconsult', // 我的咨询
        advisedetail: '/tech/advisorydetails', // 咨询详情
        techunfollow: '/tech/unfollow', // 取消技术关注
        myreward: '/agent/agentreward', // 我的奖励
        updatemanger: '/agent/updatemanger', // 升级智汇经济人
        updatefail: '/agent/updatefail', // 升级失败

        queryreward: '/agent/queryreward', // 筛选奖励
        memberindex: '/agent/memberindex', // 技术合伙人成果
        agentuploadimg: '/agent/uploadimg', // 上传证书
        agentadd: '/agent/add', // 提交升级技术合伙人
        agentedit: '/agent/edit', // 修改升级信息
        agentdetail: '/agent/detail', // 技术合伙人信息
        experts: '/expert/experts', // 明星首页
        searchbytype: '/expert/searchbytype', // 根据资源类型获取资源数据
        expertInfobyId: '/expert/expertInfobyId', // 根据供方ID获取供方信息
        shexperts: '/expert/Sexperts', // 查询专家
        expersolutiondemand: '/expert/expersolutiondemand', // 我的对接
        submitexit: '/expert/submitexit', // 申请终止。我的对接
        getpay: '/expert/getpayment', // 我的对接催款

        submitover: '/expert/submitover', // 项目完成
        optterm: '/expert/optterm', // 确认、拒绝终止
        minereservation: '/expert/minereservation', // 我的预约
        myprize: '/act/myprize', // 我的奖品
        getprize: '/act/getprize',
        Mprize: '/act/mprize', // 实物奖品领取

        scorerecord: '/mall/scorerecord', // 智币记录
        myfeedback: '/feed/myfeedback', // 我的反馈
        feedbackdetail: '/feed/detail', // 反馈详情

        filterdemand: '/demands/filterdemands', // 条件筛选需求
        login: '/passport/login',
        register: '/passport/register',
        logout: '/passport/logout',
        setnewpwd: '/passport/setnewpwd',
        appointexpert: '/expert/appointexpert',
        attentionexpert: '/expert/attentionexpert',
        carteexchange: '/expert/carteexchange',
        // 新闻
        newsindex: '/news/index',
        newsdetail: '/news/detail',
        // 行业解决方案
        brandIndex: '/unique/index',

        // 商城
        mallindex: '/mall/mallindex', // 商城首页
        suborderfrom: '/mall/suborderfrom', // 提交订单
        pageorderfrom: '/mall/pageorderfrom', // 订单首页
        orderdetail: '/mall/orderdetail', // 订单详细
        cancelorder: '/mall/cancelorder', // 取消订单
        applycencal: '/mall/applycencal', // 退换货
        subtmentdetail: '/mall/subtmentdetail', // 进度查询
        ordercue: '/mall/ordercue', // 生成支付提示扣除数
        payment: '/mall/payment' // 立即支付
    }

    function Request(options) {
        var authtoken = StorageService.Get('i_authtoken')
        if (!authtoken ||
            !authtoken.access_token ||
            authtoken.access_token === ''
        ) {
            $.ajax({
                url: '/token/',
                type: 'POST',
                async: false,
                dataType: 'json',
                success: function (result) {
                    authtoken = result.data
                    StorageService.Set('i_authtoken', authtoken)
                }
            })
        }
        _request(options, authtoken.access_token)
    }

    function InitAjaxError() {
        $(document).ajaxError(function (event, request, settings, exception) {
            if (request.status === 401) {
                var isretry = false
                if (
                    request.responseJSON.data &&
                    request.responseJSON.data.Retry
                ) {
                    isretry =
                        request.responseJSON.data.Retry === '1'
                }
                var authtoken = StorageService.Get('i_authtoken')
                $.ajax({
                    url: Api.apicorsrerefresh +
                    '?refreshtoken=' +
                    authtoken.refresh_token,
                    data: {
                        refreshtoken: authtoken.refresh_token
                    },
                    type: 'POST',
                    dataType: 'json',
                    async: true,
                    beforeSend: function (request) {
                        request.setRequestHeader(
                            'Content-Type',
                            'application/x-www-form-urlencoded'
                        )
                    },
                    success: function (result) {
                        if (result && result.data && result.data.access_token) {
                            StorageService.Set('i_authtoken', result.data)
                        } else if (result && result.err_code && result.err_code === '0011') {
                            StorageService.Set('i_authtoken', '')
                            window.location.reload()
                        }

                        if (isretry) {
                            window.setTimeout(function () {
                                if (isretry) {
                                    // debugger;
                                    var acctoken = StorageService.Get(
                                        'i_authtoken'
                                    )
                                    settings.beforeSend = function (_request) {
                                        _request.setRequestHeader(
                                            'token',
                                            acctoken.access_token
                                        )
                                    }
                                    $.ajax(settings)
                                }
                            }, 500)
                        }

                        // else {
                        //    //StorageService.Set("i_authtoken", "");
                        // }
                    }
                })
                // StorageService.Set("i_login", false);
            } else if (request.status === 403) {
                StorageService.Set('i_authtoken', '')
                window.abbrevlocation.reload()
            }
        })
    }

    function _request(opts, access_token) {
        $.ajax({
            type: opts.type,
            url: Api.domain + opts.url,
            data: opts.data,
            charset: 'UTF-8',
            async: opts.async,
            cache: opts.cache,
            dataType: 'json',
            contentType: opts.contentType,
            processData: opts.processData,
            beforeSend: function (req) {
                if (opts.beforeSend) {
                    opts.beforeSend()
                }
                req.setRequestHeader('token', access_token)
            },
            success: function (result) {
                if (
                    result &&
                    result.err_code != undefined &&
                    result.err_code &&
                    result.err_code == '-9999'
                ) {
                    window.location.reload()
                }

                if (
                    result &&
                    result.err_code != undefined &&
                    result.err_code &&
                    result.err_code == '0004'
                ) {
                    StorageService.Remove('i_authtoken')
                    // location.reload();
                }

                if (result.err_code && result.err_code == '0020') {
                    StorageService.Set('i_login', false)
                    window.location.href = '/passport/login'
                }

                opts.success(result)
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (opts.error) {
                    opts.error(XMLHttpRequest, textStatus, errorThrown)
                }
            },
            complete: opts.complete,
            pageCache: false
        })
    }

    function IsLogin() {
        if (StorageService.Get('i_login')) {
            return true
        } else {
            return false
        }
    }

    function GetCurrentUser() {
        return StorageService.Get('i_login')
    }

    function FiltHtml(html) {
        var h = html.replace(/<[^>]+>/g, '')
        return h.replace(/&nbsp;/gi, ' ')
    }

    function ConvertHtmlToText(html) {
        if (!html) return ''

        var reg = /<p[^>]*>(?:(?!<\/p>)[\s\S])*<\/p>/gi
        var array = html.match(reg)
        if (!array || array.length === 0) {
            return html
        }

        for (var i = 0; i < array.length; i++) {
            array[i] = FiltHtml(array[i])
        }

        return array.join('\n')
    }

    function ConvertTextToHtml(text) {
        if (!text) return ''

        var h = text.replace(/\n/g, '_@').replace(/\r/g, '_#')
        h = h.replace(/_#_@/g, '</br>')
        h = h.replace(/_@/g, '</br>')
        // ueditor 使用<p>
        var harray = h.split('</br>')
        if (!harray) return h

        for (var i = 0; i < harray.length; i++) {
            var item = harray[i]
            if (item) item = harray[i].replace(/\s/g, '&nbsp;')

            harray[i] = '<p>' + item + '</p>'
        }

        return harray.join('')
    }

    function LoginReturn(url) {
        return '/passport/login?returnurl=' + encodeURIComponent(url)
    }

    function logout() {
        // login out
        StorageService.Set('i_login', false)
        Request({
            type: 'post',
            url: Api.logout,
            async: false
        })
    }

    function GetReturnUrl() {
        var reg = new RegExp('(^|&)returnurl=([^&]*)(&|$)')
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return decodeURIComponent(r[2])
        return null
    }

    function GetUrlParameter(param) {
        var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return decodeURIComponent(r[2])
        return null
    }

    InitAjaxError()

    return {
        Request: Request,
        Api: Api,
        LoginReturn: LoginReturn,
        Filters: FilterService.filters,
        Storage: StorageService,
        IsLogin: IsLogin,
        GetCurrentUser: GetCurrentUser,
        ConvertHtmlToText: ConvertHtmlToText,
        ConvertTextToHtml: ConvertTextToHtml,
        logout: logout,
        GetReturnUrl: GetReturnUrl,
        GetUrlParameter: GetUrlParameter
    }
})
