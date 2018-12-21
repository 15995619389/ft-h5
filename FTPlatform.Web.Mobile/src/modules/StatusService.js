(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('StatusService', [], factory)
    } else if (typeof exports === 'object') {
        module.exports = factory()
    } else {
        root.StatusService = factory()
    }
}(this, function () {
    return {
        /* ……需求前台显示状态…… */
        DemandStatus: {
            /// <summary>
            /// 默认
            /// </summary>
            Default: 0,
            /// <summary>
            /// 草稿箱待提交
            /// </summary>
            Draft: 99,
            /// <summary>
            /// 已提交(未审核)
            /// </summary>
            Aduiting: 1,
            /// <summary>
            /// 审核成功(已发布)
            /// </summary>
            AduitSuccess: 2,
            /// <summary>
            /// 对接中
            /// </summary>

            Docked: 3,
            /// <summary>
            /// 供方上传完合同的状态值
            /// </summary>

            StayContract: 4,
            /// <summary>
            /// 项目进行中（付款完成之后的状态）
            /// </summary>

            Ongoing: 5,
            /// <summary>
            /// 供方提交补充协议状态值
            /// </summary>

            Agreement: 6,
            /// <summary>
            /// 合同签订（确认合同未付款）
            /// </summary>
            Contracted: 7,
            /// <summary>
            /// 确认项目完成
            /// </summary>

            ConfirmOver: 16,
            /// <summary>
            /// 项目完成
            /// </summary>

            Finished: 8,
            /// <summary>
            /// 已评价
            /// </summary>

            Evaluated: 9,
            /// <summary>
            /// 已终止
            /// </summary>

            Term: 10,
            /// // <summary>
            /// // 对方申请项目终止
            /// // </summary>
            // [EnumDescription("对方申请项目终止")]
            // ApplyTerm : 9,
            /// // <summary>
            /// // 申请终止（己方申请项目终止）
            /// // </summary>
            // [EnumDescription("申请项目终止")]
            // OwnApplyTerm : 10,
            /// <summary>
            /// 审核失败（待提交）
            /// </summary>

            AduitFailed: 21,
            /// <summary>
            /// 合同已拒绝
            /// </summary>
            NotContracted: 22
            /// <summary>
        },
        /* ……对接前台显示状态…… */
        ExpertStatus: {

            /// <summary>
            /// 默认
            /// </summary>
            // [EnumDescription("未知操作")]
            Default: 0,
            // [EnumDescription("综合")]
            All: 0,
            // [EnumDescription("申请解决")]
            ApplyForSolve: 1,
            // [EnumDescription("已对接")]
            ButtJoint: 2,
            // [EnumDescription("终止")]
            Termination: 5,
            // [EnumDescription("收款")]
            Proceeds: 6,
            // [EnumDescription("项目开发中")]
            Underway: 3,
            // [EnumDescription("项目已完成")]
            Finish: 4,
            // [EnumDescription("评价")]
            Evaluate: 7
        },
        /* ……需求解决状态状态…… */
        DemandSolveStatus: {
            /// <summary>
            /// 申请中
            /// </summary>
            Applying: 0,
            /// <summary>
            /// 已淘汰
            /// </summary>
            KnockOut: 1,
            /// <summary>
            /// 需方：对接中等待上传合同。供方：添加合同和付款计划
            /// </summary>
            /// 需方：对接中。供方：添加合同和付款计划
            Setp1: 2,
            /// <summary>
            /// 需方：确认合同 同意 否决。供方：合同确认中 等待合同审批
            /// </summary>
            /// 需方：确认合同和付款计划。供方：对接中
            Setp2: 3,
            /// <summary>
            /// 需方：否认合同 等待重新上传。供方：重新上传合同 完成后跳转到 Setp2
            /// </summary>
            /// 需方：对接中。供方：修改合同和付款计划
            Setp3: 4,

            /// <summary>
            /// 需方：显示项目进行中 付款按钮 供方：项目完成，增加催款按钮 催款 消息。
            /// </summary>
            /// 需方：项目进行中。供方：项目完成，催款
            Setp4: 5,

            /// <summary>
            /// 需方：确认完成 Step9、否认完成Step8。 供方 ：等待确认，催款信息
            /// </summary>
            /// 需方：确认完成。供方：等待确认，催款
            Setp5: 6,

            /// <summary>
            /// 完成
            /// </summary>
            /// 需方：完成。供方：完成
            Setp6: 7,
            /// <summary>
            /// 已终止
            /// </summary>
            Setp7: 8,
            /// <summary>
            /// 供方已评价需方
            /// </summary>
            Setp8: 9
        },
        PrizeStatus: {
            /// <summary>
            /// 未领取
            /// </summary>

            NoDraw: 0,
            /// <summary>
            /// 已领取
            /// </summary>

            YeDraw: 1,
            /// <summary>
            /// 已发货
            /// </summary>

            Delivery: 2,
            /// <summary>
            /// 已到账
            /// </summary>

            Transfer: 3,

            /// <summary>
            /// 未使用
            /// </summary>

            NoBestow: 4,
            /// <summary>
            /// 已使用
            /// </summary>

            YesBestow: 5
        },
        PrizeType: {
            /// <summary>
            /// 智币
            /// </summary>

            Dummy: 0,
            /// <summary>
            /// 实物
            /// </summary>

            Matter: 1,
            /// <summary>
            /// 话费
            /// </summary>

            TelephoneFare: 2,
            /// <summary>
            /// 再来一次
            /// </summary>

            AddTake: 3,
            /// <summary>
            /// 不中奖
            /// </summary>

            NotPrize: 4,
            /// <summary>
            /// 软件开发抵扣券
            /// </summary>

            RJKF: 5,
            /// <summary>
            /// 抽奖码
            /// </summary>

            LotteryDrawCode: 6,
            /// <summary>
            /// 品牌营销抵扣券
            /// </summary>

            PPYX: 7,
            // 爱奇艺会员
            Member: 8
        }

    }
}))
