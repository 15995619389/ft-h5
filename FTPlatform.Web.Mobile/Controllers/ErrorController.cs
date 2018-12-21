
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Internal()
        {
            return View();
        }
        public ActionResult NotFound()
        {
            return View();
        }
    }
}