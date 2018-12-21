const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");

module.exports = {
    entry: {
        common: ["jquery", "vue","./src/modules/common.js"],
        "entry.index": "./src/main.js",
        "passport.login":"./src/pages/passport/login.js",
        "passport.register":"./src/pages/passport/register.js",
        "passport.forgot":"./src/pages/passport/forgot.js",
        "passport.password":"./src/pages/passport/password.js",
        "demand.detail": "./src/pages/demand/detail.js",
        "demand.list": "./src/pages/demand/list.js",
        "demand.solve": "./src/pages/demand/solve.js",
        "demand.publish": "./src/pages/demand/publish.js",
        "demand.mylist": "./src/pages/demand/mylist.js",
        "demand.critique": "./src/pages/demand/Critique.js",
        "demand.publishdemnddetail": "./src/pages/demand/PublishDemandDetail.js",
        "demand.cqsuccess": "./src/pages/demand/cqsuccess.js",
        "companydemand.list": "./src/pages/demand/companydemand.js",
        "activity.list": "./src/pages/activity/list.js",
        "activity.share": "./src/pages/activity/12monthshare.js",
        "activity.luck": "./src/pages/Act/janluckactshare.js",
        "unique.info": "./src/pages/unique/info.js",
        "unique.list": "./src/pages/unique/list.js",
        "unique.common":"./src/pages/unique/common.js",
        "new.list": "./src/pages/new/list.js",
        "new.detail": "./src/pages/new/detail.js",
        "expert.list": "./src/pages/expert/list.js",
        "techshare.list": "./src/pages/techshare/list.js",
        "home.index": "./src/pages/home/index.js",
        "home.cates": "./src/pages/home/cates.js",
        "expert.detail": "./src/pages/expert/detail.js",
        "act.myprize": "./src/pages/act/MyPrize.js",
        "act.getprize": "./src/pages/act/GetPrize.js",
        "act.ftsecondindex": "./src/pages/act/ftsecondindex.js",
        "act.ftsuccess": "./src/pages/act/ftsuccess.js",
        "act.ftleaderboard": "./src/pages/act/ftleaderboard.js",
        "agent.index": "./src/pages/agent/index.js",
        "agent.agentreward": "./src/pages/agent/agentreward.js",
        "agent.memberindex": "./src/pages/agent/memberindex.js",
        "agent.submitfail": "./src/pages/agent/submitfail.js",
        "agent.updatemanger": "./src/pages/agent/updatemanger.js",
        "agent.wisdomsink": "./src/pages/agent/wisdomsink.js",
        "agent.writemessage": "./src/pages/agent/writemessage.js",
        "agent.submited": "./src/pages/agent/submited.js",
        "expert.applysupplier": "./src/pages/expert/applysupplier.js",
        "expert.critiquedemanduser": "./src/pages/expert/critiquedemanduser.js",
        "expert.editpatent": "./src/pages/expert/editpatent.js",
        "expert.editsupplier": "./src/pages/expert/editsupplier.js",
        "expert.expertsolutiondemand": "./src/pages/expert/expertsolutiondemand.js",
        "expert.minereservation": "./src/pages/expert/minereservation.js",
        "expert.supplierdetail": "./src/pages/expert/supplierdetail.js",
        "expert.upsupplier": "./src/pages/expert/upsupplier.js",
        "feedback.myfeedback": "./src/pages/feedback/myfeedback.js",
        "feedback.onlinefeedback": "./src/pages/feedback/onlinefeedback.js",
        "feedback.detail": "./src/pages/feedback/detail.js",
        "mall.myscoregold": "./src/pages/mall/myscoregold.js",
        "mall.getgold": "./src/pages/mall/getgold.js",
        "member.basicinformation": "./src/pages/member/basicinformation.js",
        "member.bindemail": "./src/pages/member/bindemail.js",
        "member.bindingemail": "./src/pages/member/bindingemail.js",
        "member.buscategorys": "./src/pages/member/buscategorys.js",
        "member.carte": "./src/pages/member/carte.js",
        "member.cartedetail": "./src/pages/member/cartedetail.js",
        "member.companyinfo": "./src/pages/member/companyinfo.js",
        "member.editusername": "./src/pages/member/editusername.js",
        "member.index": "./src/pages/member/index.js",
        "member.myattention": "./src/pages/member/myattention.js",
        "member.updatecompany": "./src/pages/member/updatecompany.js",
        "member.updatemycarte": "./src/pages/member/updatemycarte.js",
        "member.usermessage": "./src/pages/member/usermessage.js",
        "member.editbasic": "./src/pages/member/editbasic.js",
        "member.setnewpwd": "./src/pages/member/setnewpwd.js",
        "member.cartedetail": "./src/pages/member/cartedetail.js",
        "tech.detail": "./src/pages/techshare/detail.js",
        "tech.releasetech": "./src/pages/techshare/releasetech.js",
        "tech.sbutment": "./src/pages/techshare/sbutment.js",
        "tech.techshareconsult": "./src/pages/techshare/techshareconsult.js",
        "share": "./src/pages/share/share.js",
        "imgcropper": "./src/pages/share/imgcropper.js",
        "search.list": "./src/pages/search/search.js",
        "mall.Index": "./src/pages/mall/mallindex.js",
        "mall.detail": "./src/pages/mall/malldetail.js",
        "mall.list": "./src/pages/mall/mall_list.js",
        "mall.orderfromindex": "./src/pages/mall/orderfromindex.js",
        "mall.orderfromdetail": "./src/pages/mall/orderfromdetail.js",
        "mall.customer": "./src/pages/mall/customer.js",
        "mall.schedule": "./src/pages/mall/schedule.js",
        "tech.publish": "./src/pages/techshare/publish.js",
        "search.freeappointment": "./src/pages/search/freeappointment.js",
        "tech.advisorydetails": "./src/pages/techshare/advisorydetails.js",
        "patent.list": "./src/pages/patent/list.js",
        "patent.details": "./src/pages/patent/details.js",
        "patent.buttjointpatent": "./src/pages/patent/buttjointpatent.js",
        "patent.releaseadministerpatent": "./src/pages/patent/releaseadministerpatent.js",
        "patent.orderform": "./src/pages/patent/orderform.js",
        "patent.publish": "./src/pages/patent/publish.js",
        "high.index": "./src/pages/high/index.js",
        "high.list": "./src/pages/high/list.js",
        "high.detail": "./src/pages/high/detail.js",
        "high.articleconsulte": "./src/pages/high/articleconsulting.js",
        "high.orderenter": "./src/pages/high/orderenter.js",
        "high.buyerorder": "./src/pages/high/buyerorder.js",
        "high.buyeraddress": "./src/pages/high/buyeraddress.js",
        "high.shopindex": "./src/pages/high/shopindex.js",
        "high.sellersettled": "./src/pages/high/sellersettled.js",
        "high.buyerorderdetail": "./src/pages/high/buyerorderdetail.js",
        "high.sellerindex": "./src/pages/high/sellerindex.js",
        "high.sellergood": "./src/pages/high/sellergood.js",
        "high.newaddress": "./src/pages/high/newaddress.js", 
        "high.buyerinvoice": "./src/pages/high/buyerinvoice.js",
        "high.sellerpublishgood": "./src/pages/high/sellerpublishgood.js",
        "high.sellerorder": "./src/pages/high/sellerorder.js",
        "high.sellerorderdetail": "./src/pages/high/sellerorderdetail.js",
        "high.consultme": "./src/pages/high/consultme.js",
        "high.advice": "./src/pages/high/advice.js",
        "high.sellergooddetail": "./src/pages/high/sellergooddetail.js",
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "[name].bundle.js?[hash]"
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {}
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "img/[name].[ext]?[hash]"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "fonts/[name]..[ext]?[hash]"
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common"
        }),
        new CleanWebpackPlugin(["dist"]),
        new ManifestPlugin()
    ],
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js",
            jquery: "jquery/src/jquery",
            Vue: "vue/dist/vue.js"
        }
    }
};