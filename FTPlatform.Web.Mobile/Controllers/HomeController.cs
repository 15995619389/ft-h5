using FTPlatform.Web.Mobile.Handle.Request;
using FTPlatform.Web.Mobile.Handle.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Cates()
        {
            return View();
        }
    }
}