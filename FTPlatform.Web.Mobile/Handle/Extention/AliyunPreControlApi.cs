using Aliyun.Acs.Core;
using Aliyun.Acs.Core.Profile;
using Aliyun.Acs.Jaq.Model.V20161123;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile
{
    /// <summary>
    /// 阿里云防控Api
    /// </summary>
    public class AliyunPreControlApi
    {
        IAcsClient client = null;

        public AliyunPreControlApi()
        {
            IClientProfile profile = DefaultProfile.GetProfile("cn-hangzhou", "LTAI0Z3DT0g29uQO", "ogKZPfJglEGekVLdoMvE6fS16cYpIS");    //YOUR ACCESS_KEY��YOUR ACCESS_SECRET���滻�����İ�����accesskey id��secret
            client = new DefaultAcsClient(profile);

            DefaultProfile.AddEndpoint("cn-hangzhou", "cn-hangzhou", "jaq", "jaq.aliyuncs.com");
        }

        /// <summary>
        /// 登录防控
        /// </summary>
        /// <param name="client"></param>
        /// <param name="user"></param>
        /// <param name="ip"></param>
        /// <param name="source"></param>
        /// <param name="afs_token"></param>
        /// <param name="wtoken"></param>
        /// <returns></returns>
        //public bool PreventionLogin(UserModel user, string sessionid, string url, string referer, string ip, int source, string afs_token, string wtoken = "")
        //{
        //    LoginPreventionRequest request = new LoginPreventionRequest();
        //    // 必填参数
        //    request.PhoneNumber = user.Mobile;
        //    request.Ip = ip;
        //    request.ProtocolVersion = "1.0.1";
        //    request.Source = source;  //登录来源。1：PC网页；2：移动网页；3：APP;4:其它
        //    request.JsToken = afs_token;  //对应前端页面的afs_token，source来源为1&2&4时，必填;
        //    request.SDKToken = wtoken;  //对应sdk中获取的wtoken，source来源为3时，必填;

        //    // 选填参数
        //    request.Email = user.Email;
        //    request.UserId = user.Id.ToString();
        //    request.IdType = 1;
        //    request.CurrentUrl = url;
        //    request.Agent = "";
        //    request.Cookie = "";
        //    request.SessionId = sessionid;
        //    request.MacAddress = "";
        //    request.Referer = referer;
        //    request.UserName = "";
        //    request.CompanyName = "";
        //    request.Address = "";
        //    request.IDNumber = "";
        //    request.BankCardNumber = "";
        //    request.RegisterIp = user.RegisterIp;
        //    request.RegisterDate = 1L;
        //    request.AccountExist = 1;
        //    request.ExtendData = "";
        //    request.LoginType = 1;
        //    request.PasswordCorrect = (user == null || user.Id == 0) ? 0 : 1;

        //    try
        //    {
        //        LoginPreventionResponse response = client.GetAcsResponse(request);
        //        // TODO

        //        FTPlatform.Common.Log4Help.LogInfo("阿里云登录防控；" + response.ErrorCode + " " + response.ErrorMsg + " " + response.Data.FinalDesc);
        //        if (response.ErrorCode == 0)
        //        {
        //            if (response.Data.FinalDesc == "0")
        //                return true;
        //        }

        //    }
        //    catch (Exception e)
        //    {
        //        FTPlatform.Common.Log4Help.LogInfo("阿里云登录防控时出现异常；",e);
        //        //Console.WriteLine(e.ToString());
        //    }

        //    return false;
        //}

        /// <summary>
        /// 注册防控
        /// </summary>
        /// <param name="client"></param>
        /// <param name="user"></param>
        /// <param name="ip"></param>
        /// <param name="source"></param>
        /// <param name="afs_token"></param>
        /// <param name="wtoken"></param>
        /// <returns></returns>
        public bool PreventionReg(string mobile, string sessionid, string url, string referer, string ip, int source, string afs_token, string wtoken = "")
        {
            SpamRegisterPreventionRequest request = new SpamRegisterPreventionRequest();
            // 必填参数
            request.PhoneNumber = mobile;
            request.Ip = ip;
            request.ProtocolVersion = "1.0.1";
            request.Source = source; //注册来源。1：PC网页；2：移动网页；3：APP;4:其它
            request.JsToken = afs_token; //对应前端页面的afs_token，source来源为1&2&4时，必填;
            request.SDKToken = wtoken;//对应sdk中获取的wtoken，source来源为3时，必填;

            // 选填参数
            request.Email = "";
            request.UserId = "";
            request.IdType = 1;
            request.CurrentUrl = url;
            request.Agent = "";
            request.Cookie = "";
            request.SessionId = sessionid;
            request.MacAddress = "";
            request.Referer = referer;
            request.NickName = "";
            request.CompanyName = "";
            request.Address = "";
            request.IDNumber = "";
            request.BankCardNumber = "";
            request.ExtendData = "";

            try
            {
                SpamRegisterPreventionResponse response = client.GetAcsResponse(request);
                // TODO

                FTPlatform.Common.Log4Help.LogInfo("阿里云登录防控时；" + response.ErrorCode + " " + response.ErrorMsg + " " + response.Data.FinalDesc);
                if (response.ErrorCode == 0)
                {
                    if (response.Data.FinalDesc == "0")
                        return true;
                }
            }
            catch (Exception e)
            {
                FTPlatform.Common.Log4Help.LogInfo("阿里云注册防控时出现异常；", e);
                //Console.WriteLine(e.ToString());
            }

            return false;
        }

        public bool PreventionLoginSlide(string session, string sig, string token, string scene)
        {
            AfsCheckRequest request = new AfsCheckRequest();
            request.Platform = 3;//必填参数，请求来源： 1：Android端； 2：iOS端； 3：PC端及其他
            request.Session = session;// 必填参数，从前端获取，不可更改
            request.Sig = sig;// 必填参数，从前端获取，不可更改
            request.Token = token;// 必填参数，从前端获取，不可更改
            request.Scene = scene;// 必填参数，从前端获取，不可更改

            try
            {
                AfsCheckResponse response = client.GetAcsResponse(request);
                // TODO
                FTPlatform.Common.Log4Help.LogInfo("阿里云登录滑动；" + response.ErrorCode + " " + response.ErrorMsg + response.Data);
                if (response.ErrorCode == 0)
                {
                    if (response.Data.HasValue)
                        return true;
                }
            }
            catch (Exception e)
            {
                FTPlatform.Common.Log4Help.LogInfo("阿里云登录滑动验证出现异常；" ,e);
                //Console.WriteLine(e.ToString());
            }

            return false;

        }

        public bool PreventionRegSlide(string session, string sig, string token, string scene)
        {
            AfsCheckRequest request = new AfsCheckRequest();
            request.Platform = 3;//必填参数，请求来源： 1：Android端； 2：iOS端； 3：PC端及其他
            request.Session = session;// 必填参数，从前端获取，不可更改
            request.Sig = sig;// 必填参数，从前端获取，不可更改
            request.Token = token;// 必填参数，从前端获取，不可更改
            request.Scene = scene;// 必填参数，从前端获取，不可更改

            try
            {
                AfsCheckResponse response = client.GetAcsResponse(request);
                // TODO
                FTPlatform.Common.Log4Help.LogInfo("阿里云滑动注册；" + response.ErrorCode + " " + response.ErrorMsg + response.Data);
                if (response.ErrorCode == 0)
                {
                    if (response.Data.HasValue)
                        return true;
                }
            }
            catch (Exception e)
            {
                FTPlatform.Common.Log4Help.LogInfo("阿里云注册滑动验证出现异常；", e);
                //Console.WriteLine(e.ToString());
            }

            return false;
        }

    }
}