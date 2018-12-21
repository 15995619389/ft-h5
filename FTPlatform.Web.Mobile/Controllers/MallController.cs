using FTPlatform.Web.Mobile.Handle.Request;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class MallController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult List()
        {
            return View();
        }

        public ActionResult Detail(string Id)
        {
            ViewBag.Id = Id;
            return View();
        }

        public ActionResult Orders()
        {
            return View();
        }

        public ActionResult Gold()
        {
            return View();
        }

        //智币记录相关页面
        // GET: Mall
        public ActionResult ScoreGold()
        {
            return View();
        }
        public ActionResult Golditail()
        {
            return View();
        }
        //赚取智币链接页面
        public ActionResult GetGold()
        {
            return View();
        }
        /// <summary>
        /// 订单index
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderFromIndex()
        {
            return View();
        }
        /// <summary>
        /// 订单详细
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderFromDetail(string Id)
        {
            ViewBag.Code = Id;
            return View();
        }
        /// <summary>
        /// 申请售后
        /// </summary>
        /// <param name="Id">订单编号</param>
        /// <returns></returns>
        public ActionResult Customer(string Id)
        {
            ViewBag.Code = Id;
            return View();
        }
        /// <summary>
        /// 申请进度
        /// </summary>
        /// <returns></returns>
        public ActionResult Schedule(string Id)
        {
            ViewBag.Code = Id;
            return View();
        }
        /// <summary>
        /// 智币不足 支付失败
        /// </summary>
        /// <returns></returns>
        public ActionResult PayFial()
        {
            return View();
        }
        /// <summary>
        /// 支付成功
        /// </summary>
        /// <returns></returns>
        public ActionResult PaySecuss()
        {
            return View();
        }
   
        /// <summary>
        /// 成功回调
        /// </summary>
        /// <returns></returns>
        public ActionResult notify_orfrom()
        {
            dynamic jsonresult = new { ret_code = "9999", ret_msg = "交易失败" };
            byte[] byts = new byte[Request.InputStream.Length];
            Request.InputStream.Read(byts, 0, byts.Length);
            string req = System.Text.Encoding.UTF8.GetString(byts);
            string url = Server.UrlDecode(req).Replace("res_data=", "");
            System.IO.File.AppendAllText(Server.MapPath("~/") + "\\logex.txt", Server.UrlDecode(req));
            IApiClicent iapi = new ApiClicent("/mall/ordernotify");
            ApiMallRequest ar = new ApiMallRequest();
            ar.ReqStr = url;
            string res = iapi.Execute(ar);
            var dresult = JsonConvert.DeserializeObject<dynamic>(res);
            if ((bool)dresult.Flag)
            {
                jsonresult = new { ret_code = "0000", ret_msg = "交易成功" };
            }
            return Json(jsonresult);

        }
        /// <summary>
        /// 返回 测试获取
        /// </summary>
        /// <returns></returns>
        public ActionResult MallReturnUrl()
        {
            dynamic jsonresult = new { ret_code = "9999", ret_msg = "交易失败" };
            byte[] byts = new byte[Request.InputStream.Length];
            Request.InputStream.Read(byts, 0, byts.Length);
            string req = System.Text.Encoding.UTF8.GetString(byts);
            string url = Server.UrlDecode(req).Replace("res_data=", "");
            IApiClicent iapi = new ApiClicent("/mall/ordernotify");
            ApiMallRequest ar = new ApiMallRequest();
            ar.ReqStr = url;
            string res = iapi.Execute(ar);
            var dresult = JsonConvert.DeserializeObject<dynamic>(res);
            if ((bool)dresult.Flag)
            {
                jsonresult = new { ret_code = "0000", ret_msg = "交易成功" };
                Response.Redirect("/mall/PaySecuss");//成功
            }
            else
            {
                Response.Redirect("/mall/PayFial");//失败
            }
            return Json(jsonresult);
        }
    }
}