using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class NewsController : BaseController
    {
        /// <summary>
        /// 飞天动态
        /// </summary>
        /// <returns></returns>
        // GET: News
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 详情
        /// </summary>
        /// <returns></returns>
        public ActionResult Detail()
        {
            return View();
        }
    }
}