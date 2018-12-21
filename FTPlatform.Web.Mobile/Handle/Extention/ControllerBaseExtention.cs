
using FTPlatform.Web.Mobile.Controllers;
using System.Web.Mvc;
using System.Web.Routing;

namespace FTPlatform.Web.Mobile
{
    /// <summary>
    /// 控制器基类扩展类型
    /// </summary>
    public static class ControllaerBseExtention
    {
        private static string ApiUrl { get; set; }
        
        static ControllaerBseExtention()
        {
            ApiUrl = System.Configuration.ConfigurationManager.AppSettings["WebApiUrl"] ?? "http://service.techina2025.com/api";
        }

        /// <summary>
        /// 判断是否已经登录
        /// </summary>
        /// <param name="_this"></param>
        /// <returns></returns>
        public static bool Logged(this ControllerBase _this)
        {
            return true;
        }

        public static string GetSeed(this ControllerBase _this)
        {
            var controler = _this as BaseController;
            return controler.Seed;
        }

        public static string GetToken(this ControllerBase _this)
        {
            var controler = _this as BaseController;
            return controler.Token;
        }

        public static string GetApiUrl(this ControllerBase _this)
        {
            return ApiUrl;
        }

    }
}