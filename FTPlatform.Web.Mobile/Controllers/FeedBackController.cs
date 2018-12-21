using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class FeedBackController : BaseController
    {
        // GET: FeedBack
        /// <summary>
        /// 我的反馈
        /// </summary>
        /// <returns></returns>
        public ActionResult MyFeedback()
        {
            return View();
        }
        /// <summary>
        /// 反馈详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult FeedbackDetail(int id)
        {
            ViewBag.id = id;
            return View();
        }
        public ActionResult OnlineFeedback()
        {
            return View();
        }
    }
}