using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class BaseController : Controller
    {
        // GET: Base
        //public ActionResult Index()
        //{
        //    return View();
        //}

        public string Seed {
            get {
                return TechinaApiEncry.CreateApiSeed();
            }
        }

        public string Token
        {
            get
            {
                return TechinaApiEncry.CreateApiToken(this.Seed);
            }
        }

    }
}