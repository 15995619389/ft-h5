using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class AgentController : BaseController
    {
        /// <summary>
        /// 技术合伙人
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }
        //我的奖励
        public ActionResult AgentReward()
        {
            return View();
        }
        //升级智慧经济人
        public ActionResult Updatemanger()
        {
            return View();
        }
        //智汇经济人成果
        public ActionResult MemberIndex()
        {
            return View();
        }
        //提交成功页面
        public ActionResult Submited()
        {
            return View();
        }
        //申请结果
        public ActionResult Submitfail()
        {
            return View();
        }
        //登记
        public ActionResult WisdomSink()
        {
            return View();
        }

        //升级信息修改
        public ActionResult Writemessage()
        {
            return View();
        }
    }
}