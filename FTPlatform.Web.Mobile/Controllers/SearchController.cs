using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class SearchController : BaseController
    {
        public ActionResult Index(string skey)
        {
            return View();
        }

        /// <summary>
        /// 首页免费预约
        /// </summary>
        /// <returns></returns>
        public ActionResult FreeAppointment()
        {
            return View();
        }
    }
}