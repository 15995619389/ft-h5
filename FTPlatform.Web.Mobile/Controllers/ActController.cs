using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class ActController : BaseController
    {
        /// <summary>
        /// 我的奖品页面
        /// </summary>
        /// <returns></returns>
        public ActionResult MyPrize()
        {
            return View();
        }
        /// <summary>
        /// 领取奖品
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetPrize()
        {
            return View();
        }
        /// <summary>
        /// 领取成功
        /// </summary>
        /// <returns></returns>
        public ActionResult GetSuccess()
        {
            return View();
        }
        //智币商城11月份活动
        public ActionResult Novacticy()
        {
            return View();
        }
        //新增飞天众智两周年活动页面--首页
        //
        public ActionResult FtSecondIndex()
        {
            return View();
        }
        //新增飞天众智两周年活动--成功案例  
        public ActionResult FtSuccess()
        {
            return View();
        }
        //新增飞天众智两周年活动--票数排行榜  leaderboard
        public ActionResult FtLeaderBoard()
        {
            return View();
        }
        //新增飞天众智两周年活动--票数排行榜  leaderboard
        public ActionResult DecemberIndex()
        {
            return View("~/Views/Activity/201712/DecemberIndex.cshtml");
        }
        public ActionResult JanLuckyAct()
        {
            return View("~/Views/Activity/201801/JanLuckyAct.cshtml");
        }
        public ActionResult LabaFestival()
        {
            return View("~/Views/Activity/laba/LabaIndex.cshtml");
        }
       
    }
}