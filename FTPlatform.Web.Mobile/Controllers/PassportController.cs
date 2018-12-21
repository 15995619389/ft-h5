using FTPlatform.Web.Mobile.Handle.Request;
using FTPlatform.Web.Mobile.Handle.Response;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class PassportController : BaseController
    {
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginViewModel usermodel)
        {
            RespondResult result = new RespondResult();
            result.Flag = false;

            if (ModelState.IsValid)
            {

                ApiLoginRequest loginrequest = new ApiLoginRequest();
                loginrequest.afs_scene = usermodel.afs_scene;
                loginrequest.afs_token = usermodel.afs_token;
                loginrequest.csessionid = usermodel.csessionid;
                loginrequest.Mobile = usermodel.Mobile;
                loginrequest.PassWord = usermodel.PassWord;
                loginrequest.RememberMe = usermodel.RememberMe;
                loginrequest.scene = usermodel.scene;
                loginrequest.sig = usermodel.sig;
                loginrequest.token = usermodel.token;

                IApiClicent iapi = new ApiClicent("/apidemo/GetMypara");
                ApiLoginResponse res = iapi.Execute<ApiLoginResponse>(loginrequest);

                if (!res.iserr)
                {
                    result.Flag = true;
                }
                result.Message = res.err_msg;

                return Json(result, JsonRequestBehavior.DenyGet);
            }
            else
            {
                var item = ModelState.Values.FirstOrDefault(s => s.Errors.Count > 0);
                result.Flag = false;
                result.Message = item.Errors.FirstOrDefault().ErrorMessage;
            }
            return Json(result, JsonRequestBehavior.DenyGet);
        }


        #region 第三方登录绑定

        public ActionResult WechatLogin()
        {
            //string sitepath = ConfigHelper.GetConfig("SitePath");
            //var sitepath = "http://www.techina2025.com/";
            string reUrl = "";// WechatAuthLogin.GetwxLoginUrl("", Server.UrlEncode(sitepath + "passport/wechatbind"), "/");
            return Redirect(reUrl);
        }

        //public string GetwxMobileLoginUrl(string appid, string redirect_uri, string state, string response_type = "code", string scope = "snsapi_userinfo")
        //{
        //    if (string.IsNullOrWhiteSpace(appid))
        //        appid = "wxb13f4b2f61528fdd";
        //    return string.Format("https://open.weixin.qq.com/sns/explorer_broker?appid={0}&redirect_uri={1}&response_type={2}&scope={3}&state={4}&connect_redirect=1#wechat_redirect", appid, redirect_uri, response_type, scope, state);
        //}

        public ActionResult WechatBind()
        {
            string code = Request["code"];
            string state = Request["state"];

            if (string.IsNullOrWhiteSpace(code))
            {
                return View();
            }

            wxError<AccessToken> result = WechatAuthLogin.GetAccessTokenByCode("", "", code);
            if (result.IsSuccess)
            {
                ApiGetUserByWxCodeRequest request = new ApiGetUserByWxCodeRequest();
                request.Code = result.Data.openid;

                IApiClicent iapi = new ApiClicent("/user/querybywx");
                ApiGetUserByWxResponse res = iapi.Execute<ApiGetUserByWxResponse>(request);
                if (!res.iserr)
                {
                    Session["CurrentUser"] = res.UserName;
                    return Redirect("/");
                }
                Session["AccessToken"] = result.Data;
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult WechatBind(string Mobile, string PassWord)
        {
            if (string.IsNullOrWhiteSpace(Mobile))
            {
                ModelState.AddModelError("Mobile", "请输入您原来的用户名或手机号码.");
                return View();
            }
            if (string.IsNullOrWhiteSpace(PassWord))
            {
                ModelState.AddModelError("PassWord", "请输入您的密码.");
                return View();
            }

            if (ModelState.IsValid)
            {
                ApiBindWechatRequest request = new ApiBindWechatRequest();
                request.UserName = Mobile;
                request.Password = PassWord;

                AccessToken token = Session["AccessToken"] as AccessToken;
                request.ThirdID = token.openid;

                IApiClicent iapi = new ApiClicent("/user/bindwechat");
                ApiGetUserByWxResponse res = iapi.Execute<ApiGetUserByWxResponse>(request);
                if (!res.iserr)
                {
                    Session["CurrentUser"] = res.UserName;
                    return Redirect("/");
                }

                ModelState.AddModelError("", res.err_msg);
            }
            else
            {
                var item = ModelState.Values.FirstOrDefault(s => s.Errors.Count > 0);
                ModelState.AddModelError("", item.Errors.FirstOrDefault().ErrorMessage);
            }

            return View();
        }

        #endregion

        public ActionResult Register(string Code = "")
        {
            ViewBag.RefCode = Code;
            return View();
        }

        #region 找回密码

        public ActionResult FindPwd()
        {
            return View();
        }

        public ActionResult SetNewPwd()
        {
            if (Session["FindVerCode"] == null)
                return View("FindPwd");

            return View();
        }

        public ActionResult VerMobileVerCode(VerCodeModel vercode)
        {
            RespondResult result = new RespondResult();
            result.Flag = false;
            result.Message = "验证失败.";

            if (ModelState.IsValid)
            {
                ApiFindPwdRequest request = new ApiFindPwdRequest();
                request.Mobile = vercode.Mobile;
                request.VerCode = vercode.Code;

                request.afs_scene = vercode.afs_scene;
                request.afs_token = vercode.afs_token;
                request.scene = vercode.scene;
                request.sig = vercode.sig;
                request.token = vercode.token;
                request.csessionid = vercode.csessionid;

                IApiClicent iapi = new ApiClicent("/passport/vermobilecode");
                //ApiFindPwdResponse res = iapi.Execute<ApiFindPwdResponse>(request);
                string res = iapi.Execute(request);
                var dresult = JsonConvert.DeserializeObject<dynamic>(res);
                if (dresult.Flag.Value)
                {
                    Session["FindVerCode"] = vercode;

                    result.Flag = true;
                    return Json(result);
                }

                result.Message = dresult.Message.Value;
            }

            return Json(result);
        }

        [HttpPost]
        public ActionResult ModifyPwd(ModifyPwdModel setPwd)
        {
            RespondResult result = new RespondResult();
            result.Flag = false;
            result.Message = "验证失败.";

            if (ModelState.IsValid)
            {
                if (Session["FindVerCode"] == null)
                {
                    result.Flag = false;
                    result.StausCode = "1001";
                    result.Message = "验证已过期.";
                    return Json(result);
                }

                VerCodeModel vercode = (VerCodeModel)Session["FindVerCode"];

                ApiFindPwdRequest request = new ApiFindPwdRequest();
                request.Pwd = setPwd.Pwd;
                request.VerPwd = setPwd.VerPwd;
                request.VerCode = vercode.Code;
                request.Mobile = vercode.Mobile;

                request.afs_scene = vercode.afs_scene;
                request.afs_token = vercode.afs_token;
                request.scene = vercode.scene;
                request.sig = vercode.sig;
                request.token = vercode.token;
                request.csessionid = vercode.csessionid;

                IApiClicent iapi = new ApiClicent("/passport/findpwdformobile");
                //ApiFindPwdResponse res = iapi.Execute<ApiFindPwdResponse>(request);
                string res = iapi.Execute(request);
                var dresult = JsonConvert.DeserializeObject<dynamic>(res);
                if (dresult.Flag.Value)
                {
                    result.Flag = true;
                    result.Message = dresult.Message.Value;
                    return Json(result);
                }

                result.Message = dresult.Message.Value;
            }
            else
            {
                var item = ModelState.Values.FirstOrDefault(s => s.Errors.Count > 0);
                result.Flag = false;
                result.Message = item.Errors.FirstOrDefault().ErrorMessage;
            }

            return Json(result);
        }

        #endregion
    }

    public class ModifyPwdModel
    {
        [Required]
        [MinLength(6, ErrorMessage = "密码长度须6位字符以上")]
        [MaxLength(16, ErrorMessage = "密码长度须少于16位字符")]
        [Display(Name = "密码")]
        [RegularExpression(@"(?=.*\d)(?=.*[a-zA-Z]).{6,16}", ErrorMessage = "请至少设置两种字符(英文字母、数字)组合，不允许使用特殊符号，如:~!@#$%^&*")] //(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}
        public string Pwd { get; set; }

        [Required]
        [System.ComponentModel.DataAnnotations.Compare("Pwd", ErrorMessage = "两次输入的密码不一致.")]
        public string VerPwd { get; set; }
    }

    public class VerCodeModel
    {
        public string Mobile { get; set; }
        public string Code { get; set; }

        public string afs_scene { get; set; }
        public string afs_token { get; set; }

        //滑动验证
        public string csessionid { get; set; }
        public string sig { get; set; }
        public string token { get; set; }
        public string scene { get; set; }

    }

    public class RegisterViewModel
    {
        [Required]
        [Display(Name = "用户名")]
        [RegularExpression(@"^1(3|4|5|6|7|8)\d{9}$", ErrorMessage = "手机号码有误，请重新输入.")]
        public string Mobile { get; set; }

        [Required]
        [Display(Name = "验证码")]
        [StringLength(6)]
        [MaxLength(6)]

        public string Code { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "密码长度须6位字符以上")]
        [MaxLength(16, ErrorMessage = "密码长度须少于16位字符")]
        [Display(Name = "密码")]
        [RegularExpression(@"(?=.*\d)(?=.*[a-zA-Z]).{6,16}", ErrorMessage = "请至少设置两种字符(英文字母、数字)组合，不允许使用特殊符号，如:~!@#$%^&*")] //(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}
        public string Password { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(16)]
        [Display(Name = "确认密码")]
        public string ConfirmPwd { get; set; }

        [Required]
        public int UserType { get; set; }

        [MaxLength(50)]
        public string Referee { get; set; }

        public bool IsAgreeProtocol { get; set; }

        //防机器
        public string afs_scene { get; set; }

        public string afs_token { get; set; }

        //滑动验证
        public string csessionid { get; set; }
        public string sig { get; set; }
        public string token { get; set; }
        public string scene { get; set; }


    }

    public class ValidateCodeModel
    {
        /// <summary>
        /// 如果为登录状态
        /// </summary>
        public int? UserId { get; set; }

        [Required]
        [MaxLength(300)]
        public string Mobile { set; get; }

        [MaxLength(10)]
        public string Code { set; get; }

        [MaxLength(10)]
        public string IamgeVerCode { set; get; }

        [MaxLength(50)]
        public string Mark { get; set; }

        [MaxLength(500)]
        public string Content { get; set; }

        /// <summary>
        /// 1 已使用  0 未使用
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// 过期时间
        /// </summary>
        public DateTime ExpierTime { get; set; }

        /// <summary>
        /// Session Id
        /// </summary>
        public string SessionId { get; set; }

        /// <summary>
        /// IP 地址
        /// </summary>
        public string Ip { get; set; }



        //防机器
        public string afs_scene { get; set; }

        public string afs_token { get; set; }

        //滑动验证
        public string csessionid { get; set; }
        public string sig { get; set; }
        public string token { get; set; }
        public string scene { get; set; }


    }
}