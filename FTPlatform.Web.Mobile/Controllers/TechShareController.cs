//using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace FTPlatform.Web.Mobile.Controllers
{
    /// <summary>
    /// 技术相关页面
    /// </summary>
    public class TechShareController : BaseController
    {
        // GET: TechShare
        public ActionResult Index(string search)
        {
            ViewBag.search = search;
            return View();
        }
        //技术详情
        public ActionResult Detail()
        {
            return View();
        }
        //发布技术管理页面
        public ActionResult ReleaseTechnology()
        {
            return View();
        }

        //对接技术管理
        public ActionResult Sbutment()
        {
            return View();
        }
        /// <summary>
        /// 我的咨询页面
        /// </summary>
        /// <returns></returns>
        public ActionResult TechShareConsult()
        {
            return View();
        }

        /// <summary>
        /// 技术发布
        /// </summary>
        /// <returns></returns>
        public ActionResult Publish()
        {
            return View();
        }
        //咨询详情
        public ActionResult AdvisoryDetails()
        {
            return View();
        }

    }
}