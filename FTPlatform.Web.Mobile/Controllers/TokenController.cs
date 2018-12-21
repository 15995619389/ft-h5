using FTPlatform.Web.Mobile.Handle.Request;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTPlatform.Web.Mobile.Controllers
{
    public class TokenController : Controller
    {
        // GET: Token
        //public ActionResult Index()
        //{
        //    return View();
        //}

        public ActionResult Index()
        {
            ApiTokenRequest request = new ApiTokenRequest();
            request.appId = "Techina2025_H5";
            request.appSecret = "241cf9a8de4226a12d63a513481e4374";
            request.nonce = Guid.NewGuid().ToString("n");
            request.clientIp = WebHelper.GetClientIp();
            request.clientSession = Session.SessionID;

            IApiClicent iapi = new ApiClicent("/token/");
            //ApiTokenResponse<dynamic> res = iapi.Execute<ApiTokenResponse<dynamic>>(request);
            string res = iapi.Execute(request);
            return Content(res);
        }

        public ActionResult Refresh(string refreshtoken)
        {
            ApiRefreshTokenRequest request = new ApiRefreshTokenRequest();
            request.refreshToken = refreshtoken;
            request.clientIp = WebHelper.GetClientIp();

            IApiClicent iapi = new ApiClicent("/token/refresh");
            //ApiRefreshTokenResponse res = iapi.Execute<ApiRefreshTokenResponse>(request);
            string res = iapi.Execute(request);
            return Content(res);
        }
    }
}