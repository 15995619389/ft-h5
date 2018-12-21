using FTPlatform.Web.Mobile.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace FTPlatform.Web.Mobile
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            RouteProvider.RegisterRoutes(routes);
            routes.MapRoute(
                name: "Register",
                url: "passport/register/{Code}",
                defaults: new { controller = "Passport", action = "Register", Code = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }                
            );
        }
    }
}
