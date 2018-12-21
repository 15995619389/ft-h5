using FTPlatform.Web.Mobile.Handle.Request;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class HighController : BaseController
    {
        #region 高端产品相关
        // GET: High  首页 
        public ActionResult ArticleIndex()
        {
            return View();
        }
        //更多商品 list
        public ActionResult ArticleList()
        {
            return View();
        }

        /// <summary>
        /// 商店首页
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopIndex()
        {
            return View();
        }

        //首页高端产品详情
        public ActionResult ArticleDetail()
        {
            return View();
        }

        /// <summary>
        /// 订单确认
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderEnter(int id)
        {
            ViewBag.ProductId = id;
            return View();
        }
        //立即咨询 
        public ActionResult Consulting()
        {
            return View();
        }
        #endregion

        #region 买家中心
        /// <summary>
        /// 收货地址列表
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerAddress()
        {
            return View();
        }

        /// <summary>
        /// 发票列表
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerInvoice()
        {
            return View();
        }

        /// <summary>
        /// 买家订单列表
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerOrder()
        {
            return View();
        }
        ///<summary>
        ///新增收货地址
        /// </summary>
        /// <returns></returns>
        public ActionResult  BuyerNewAddress()
        {
            return View();
        }

        /// <summary>
        /// 买家订单详细
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerOrderDetail()
        {
            return View();
        }

        /// <summary>
        /// 买家我的咨询
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerAdvice()
        {
            return View();
        }
        #endregion

        #region 卖家中心
        /// <summary>
        /// 卖家首页
        /// </summary>
        /// <returns></returns>

        public ActionResult SellerIndex()
        {
            return View();
        }

        /// <summary>
        /// 商家入驻
        /// </summary>
        /// <returns></returns>
        public ActionResult SellerSettled()
        {
            return View();
        }

        /// <summary>
        /// 卖家订单列表
        /// </summary>
        /// <returns></returns>
        public ActionResult SellerOrder()
        {
            return View();
        }

        /// <summary>
        /// 卖家订单详细
        /// </summary>
        /// <returns></returns>
        public ActionResult SellerOrderDetail()
        {
            return View();
        }

        /// <summary>
        /// 卖家商品列表
        /// </summary>
        /// <returns></returns>
        public ActionResult SellerGood()
        {
            return View();
        }

        /// <summary>
        /// 卖家商品详细
        /// </summary>
        /// <returns></returns>
        public ActionResult SellerGoodDetail()
        {
            return View();
        }

        /// <summary>
        /// 卖家发布商品
        /// </summary>
        /// <returns></returns>
        public ActionResult SellerPublishGood()
        {
            return View();
        }

        /// <summary>
        /// 咨询我的
        /// </summary>
        /// <returns></returns>
        public ActionResult SellerConsultMe()
        {
            return View();
        }
        #endregion

        /// <summary>
        /// 连连后台通知
        /// </summary>
        /// <returns></returns>
        public ActionResult Notification()
        {
            dynamic result = new { ret_code = "9999", ret_msg = "交易失败" };
            byte[] byts = new byte[Request.InputStream.Length];
            Request.InputStream.Read(byts, 0, byts.Length);
            string req = System.Text.Encoding.UTF8.GetString(byts);
            string url = Server.UrlDecode(req).Replace("res_data=", "");
            System.IO.File.AppendAllText(Server.MapPath("~/") + "\\logex.txt", Server.UrlDecode(req));
            IApiClicent iapi = new ApiClicent("/highs/ordernotify");
            ApiMallRequest ar = new ApiMallRequest();
            ar.ReqStr = url;
            string res = iapi.Execute(ar);
            var dresult = JsonConvert.DeserializeObject<dynamic>(res);
            if (dresult.err_code == "0000")
            {
                result = new { ret_code = "0000", ret_msg = "交易成功" };
            }
            return Json(result);
        }

        /// <summary>
        /// 连连支付后返回的页面
        /// </summary>
        /// <returns></returns>
        public ActionResult PayResult(string returnUrl)
        {
            var isResult = 0;
            dynamic result = new { ret_code = "9999", ret_msg = "交易失败" };

            byte[] byts = new byte[Request.InputStream.Length];
            Request.InputStream.Read(byts, 0, byts.Length);
            string req = System.Text.Encoding.UTF8.GetString(byts);
            string url = Server.UrlDecode(req).Replace("res_data=", "");
            IApiClicent iapi = new ApiClicent("/highs/ordernotify");
            ApiMallRequest ar = new ApiMallRequest();
            ar.ReqStr = url;
            string res = iapi.Execute(ar);
            var dresult = JsonConvert.DeserializeObject<dynamic>(res);
            if (dresult.err_code == "0000")
            {
                result = new { ret_code = "0000", ret_msg = "交易成功" };
                isResult = 1;
            }
            else
            {
                isResult = 0;
            }
            ViewBag.isResult = isResult;

            if (!string.IsNullOrWhiteSpace(returnUrl))
            {
                return Redirect(returnUrl + "?isResult=" + isResult);
            }
            else
            {
                return View();
            }
        }
    }
}