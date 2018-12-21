using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class UniqueController : Controller
    {

        /// <summary>
        /// 自营产品列表
        /// </summary>
        /// <returns></returns>
        public ActionResult List()
        {
            return View();
        }

        /// <summary>
        /// 自营产品详情
        /// </summary>
        /// <returns></returns>
        public ActionResult Info()
        {
            return View();
        }

        /// <summary>
        /// 知识产权
        /// </summary>
        /// <returns></returns>
        public ActionResult IntellectualProperty()
        {
            return View();
        }

        /// <summary>
        /// 航天搭载
        /// </summary>
        /// <returns></returns>
        public ActionResult SpaceBorne()
        {
            return View();
        }

        /// <summary>
        /// 军工四证
        /// </summary>
        /// <returns></returns>
        public ActionResult MilitaryFour()
        {
            return View();
        }

        /// <summary>
        /// 检测
        /// 检测静态页，未来可能将在产品服务中维护
        /// </summary>
        /// <returns></returns>
        public ActionResult Detection()
        {
            return View();
        }

        /// <summary>
        /// 失效分析检测
        /// </summary>
        /// <returns></returns>
        public ActionResult FaAnalysis()
        {
            return View();
        }

        /// <summary>
        /// 无损检测
        /// </summary>
        /// <returns></returns>
        public ActionResult NoTesting()
        {
            return View();
        }

        /// <summary>
        /// 复合材料检测
        /// </summary>
        /// <returns></returns>
        public ActionResult Composites()
        {
            return View();
        }
        /// 中国制造2025会议
        public ActionResult Fabricate()
        {
            return View();
        }
        /// 航天育种
        public ActionResult Breeding()
        {
            return View();
        }
        ///国防域名注册 
        public ActionResult Defence()
        {
            return View();
        }
        ///国防实验室认可（DiLac）咨询业务
        public ActionResult DiLac()
        {
            return View();
        }
        ///航天体验园
        public ActionResult Experience()
        {
            return View();
        }
        ///钱学森专题
        public ActionResult DeepBBS()
        {
            return View();
        }
        ///院士工作站
        public ActionResult Workstation()
        {
            return View();
        }
    }
}