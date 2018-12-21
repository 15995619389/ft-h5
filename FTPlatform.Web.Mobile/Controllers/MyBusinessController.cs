using FTPlatform.Web.Mobile.Handle.Request;
using FTPlatform.Web.Mobile.Handle.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class MyBusinessController : BaseController
    {
        // GET: MyBusiness
        public ActionResult Index()
        {
            return View();
        }       
        //个人基本信息
        public ActionResult BasicInformation()
        {
            ViewBag.BMSucc = !string.IsNullOrWhiteSpace(Request["bm"]) ? Request["bm"] : "";
            return View();
        }
        //企业用户信息
        public ActionResult CompanyInfo()
        {
            return View();
        }
        //企业信息编辑
        public ActionResult UpdateCompany()
        {
            return View();
        }
        //修改用户名
        public ActionResult EditUserName(string content)
        {
            ViewBag.username = content;
            return View();
        }
        //修改工作单位、真实姓名等
        public ActionResult EditBasic(int type,string content)
        {
            ViewBag.type = type;
            ViewBag.content = content;
            return View();
        }
        //绑定邮箱
        public ActionResult BindEmail(string email)
        {
            ViewBag.email = email;
            return View();
        }
        //绑定成功待验证
        public ActionResult BindingEmail()
        {
            string email = Request["email"];
            string uid = Request["uid"];
            string code = Request["_t"];
            ViewBag.email = email;
            ViewBag.uid = uid;
            ViewBag.code = code;
            return View();
        
    }
        //业务分类表
        public ActionResult BusCategorys()
        {
            return View();
        }
        //我的名片列表页面
        public ActionResult Carte()
        {
            return View();
        }
        //我的名片
        public ActionResult MyCarte(int id)
        {
            ViewBag.id = id;
            return View();
        }
        //编辑我的名片
        public ActionResult UpdateMyCarte()
        {
            return View();
        }
        //历史消息
        public ActionResult UserMessage()
        {
            return View();
        }
        //我的关注
        public ActionResult MyAttention()
        {
            return View();
        }
        //修改密码
        public ActionResult SetNewPwd()
        {
            return View();
        }
        //密码修改成功
        public ActionResult UpdatePwdSucess()
        {
            return View();
        }
    }
}