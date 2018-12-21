using FTPlatform.Web.Mobile.Handle.Request;
using FTPlatform.Web.Mobile.Handle.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class DemandController : BaseController
    {
        /// <summary>
        /// 需求列表
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 企服需求库
        /// </summary>
        /// <returns></returns>
        public ActionResult Companys()
        {
            return View();
        }

        /// <summary>
        /// 需求详情
        /// </summary>
        /// <returns></returns>
        public ActionResult Detail()
        {
            return View();
        }

        /// <summary>
        /// 需求发布
        /// </summary>
        /// <returns></returns>
        public ActionResult Publish(int id=0)
        {
            ViewBag.id = id;
            return View();
        }

        /// <summary>
        /// 解决需求
        /// </summary>
        /// <returns></returns>
        public ActionResult Solve()
        {
            return View();
        }

        /// <summary>
        /// 解决需求成功
        /// </summary>
        /// <returns></returns>
        public ActionResult SolveSuccess()
        {
            return View();
        }

        /// <summary>
        /// 发布需求成功
        /// </summary>
        /// <returns></returns>
        public ActionResult Submited()
        {
            return View();
        }

        /// <summary>
        /// 保存需求成功
        /// </summary>
        /// <returns></returns>
        public ActionResult Saved()
        {
            return View();
        }

        /// <summary>
        /// 需求评价
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Critique(int id)
        {
            ViewBag.id = id;
            return View();
        }

        /// <summary>
        /// 我的需求
        /// </summary>
        /// <returns></returns>
        public ActionResult PublishDemand()
        {
            return View();
        }

        /// <summary>
        /// 个人中心需求详情
        /// </summary>
        /// <returns></returns>
        public ActionResult PublishDemandDetail()
        {
            return View();
        }

        /// <summary>
        /// 评价成功
        /// </summary>
        /// <returns></returns>
        public ActionResult CqSuccess()
        {
            return View();
        }
    }
}
