using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class PatentController : Controller
    {
        // GET: Patent
        public ActionResult Index()
        {
            return View();
        }
        //专利详情
        public ActionResult Details()
        {
            return View();
        }
        //申请成功 
        public ActionResult ApplySuccess()
        {
            return View();
        }
        //对接专利管理 
        public ActionResult ButtJointPanent()
        {
            return View();
        }
        //发布专利管理  
        public ActionResult ReleaseaDministerPatent()
        {
            return View();
        }
        //我的专利订单 
        public ActionResult OrderForm()
        {
            return View();
        }
        //发布技术专利 
        public ActionResult Publish()
        {
            return View();
        }
        //保存
        public ActionResult Saved()
        {
            return View();
        }
        //提交
        public ActionResult Submited()
        {
            return View();
        }
        //申请成功
        public ActionResult ApplyOk()
        {
            return View();
        }
    }
}