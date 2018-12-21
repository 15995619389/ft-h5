using FTPlatform.Web.Mobile.Handle.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class ActivityController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ExpoIndex()
        {
            return View("~/Views/Activity/Expo/ExpoIndex.cshtml");
        }
        public ActionResult ApplyInfo()
        {
            return View("~/Views/Activity/Expo/ApplyInfo.cshtml");
        }
        // 新增9月线上活动控制器
        public ActionResult SepActivity()
        {
            return View("~/Views/Activity/201709/SepActivity.cshtml");
        }
        //新增12月双旦大富翁活动 
        public ActionResult DecemberIndex()
        {
            return View("~/Views/Activity/201712/DecemberIndex.cshtml");
        }
        public ActionResult JanLuckyAct()
        {
            return View("~/Views/Activity/201801/JanLuckyAct.cshtml");
        }
        public ActionResult LabaIndex()
        {
            return View("~/Views/Activity/laba/LabaIndex.cshtml");
        }
        public ActionResult LabaDatail()
        {
            return View("~/Views/Activity/laba/LabaDatail.cshtml");
        }
        public ActionResult LabaList()
        {
            return View("~/Views/Activity/laba/LabaList.cshtml");
        }
    }
}