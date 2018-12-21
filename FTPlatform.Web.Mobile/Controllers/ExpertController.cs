using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    /// <summary>
    /// 供方相关页面
    /// </summary>
    public class ExpertController : BaseController
    {
        /// <summary>
        /// 供方信息(技术资源库)
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// 供方详细
        /// </summary>
        /// <returns></returns>

        public ActionResult Detail()
        {
            return View();
        }
        //申请供方
        public ActionResult ApplySupplier()
        {
            return View();
        }

        /// <summary>
        /// 修改申请供方
        /// </summary>
        /// <returns></returns>
        public ActionResult UpSupplier()
        {
            return View();
        }

        /// <summary>
        /// 我的对接页面
        /// </summary>
        /// <returns></returns>
        public ActionResult ExperSolutionDemand()
        {
            return View();
        }
        /// <summary>
        /// 添加协议
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult UploadContractView(int id)
        {
            ViewBag.id = id;
            return View();
        }
        /// <summary>
        /// 供方详情页
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult SupplierDetail()
        {
            return View();
        }
        //编辑供方资料
        public ActionResult EditSupplier(int type)
        {
            ViewBag.type = type;
            return View();
        }
        //编辑专利
        public ActionResult EditPatent(int id)
        {
            ViewBag.id = id;
            return View();
        }
        //我的预约
        public ActionResult MineReservation()
        {
            return View();
        }
        /// <summary>
        /// 评价需方
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult CritiqueDemandUser(int id)
        {
            ViewBag.id = id;
            return View();
        }

    }
}