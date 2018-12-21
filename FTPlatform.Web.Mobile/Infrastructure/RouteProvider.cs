using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace FTPlatform.Web.Mobile.Infrastructure
{
    public class RouteProvider
    {

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.MapRoute(
            name: "HighArticleIndex",
            url: "higharticle/",
            defaults: new { controller = "High", action = "ArticleIndex" },
            namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
             );

            routes.MapRoute(
             name: "HighArticleList",
             url: "higharticlelist/",
             defaults: new { controller = "High", action = "ArticleList" },
             namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
              );

            routes.MapRoute(
               name: "HighArticleDetail",
               url: "higharticle/{id}",
               defaults: new { controller = "High", action = "ArticleDetail" },
               namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
               );

            routes.MapRoute(
            name: "BuyerAddress",
            url: "buyer/address",
            defaults: new { controller = "High", action = "BuyerAddress" },
            namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
             );

            routes.MapRoute(
          name: "BuyerInvoice",
          url: "buyer/invoice",
          defaults: new { controller = "High", action = "BuyerInvoice" },
          namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
           );

            routes.MapRoute(
                name: "BuyerOrder",
                url: "buyer/order",
                defaults: new { controller = "High", action = "BuyerOrder" },
                namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
                 );
            //新增收货地址
            routes.MapRoute(
                name: "BuyerNewAddress",
                url: "buyer/newaddress",
                defaults: new { controller = "High", action = "BuyerNewAddress" },
                namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
                 );


            routes.MapRoute(
             name: "BuyerOrderDetail",
             url: "buyer/orderdetail",
             defaults: new { controller = "High", action = "BuyerOrderDetail" },
             namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
              );

            routes.MapRoute(
             name: "BuyerAdvice",
             url: "buyer/advice",
             defaults: new { controller = "High", action = "BuyerAdvice" },
             namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
              );

            routes.MapRoute(
           name: "ShopIndex",
           url: "shop/",
           defaults: new { controller = "High", action = "ShopIndex" },
           namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
            );

            routes.MapRoute(
            name: "SellerIndex",
            url: "seller/",
            defaults: new { controller = "High", action = "SellerIndex" },
            namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
             );
            //发布商品
            routes.MapRoute(
               name: "SellerPublishGood",
               url: "seller/publishgood/{id}",
               defaults: new { controller = "High", action = "SellerPublishGood", id = UrlParameter.Optional },
               namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
            );

            routes.MapRoute(
             name: "SellerSettled",
             url: "seller/settled",
             defaults: new { controller = "High", action = "SellerSettled" },
             namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
              );

            routes.MapRoute(
           name: "SellerOrder",
           url: "seller/order",
           defaults: new { controller = "High", action = "SellerOrder" },
           namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
            );

            routes.MapRoute(
            name: "SellerGood",
            url: "seller/good",
            defaults: new { controller = "High", action = "SellerGood" },
            namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
             );

            routes.MapRoute(
             name: "SellerConsultMe",
             url: "seller/consultme",
             defaults: new { controller = "High", action = "SellerConsultMe" },
             namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
              );

            routes.MapRoute(
            name: "SellerOrderDetail",
            url: "seller/orderdetail",
            defaults: new { controller = "High", action = "SellerOrderDetail" },
            namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
             );

            routes.MapRoute(
           name: "SellerGoodDetail",
           url: "seller/gooddetail",
           defaults: new { controller = "High", action = "SellerGoodDetail" },
           namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
            );

            routes.MapRoute(
          name: "HighArticleConsulting",
          url: "higharticle/consulting/{id}",
          defaults: new { controller = "High", action = "Consulting" },
          namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
           );

            routes.MapRoute(
            name: "HighArticleOrderEnter",
            url: "higharticle/orderenter/{id}",
            defaults: new { controller = "High", action = "OrderEnter" },
            namespaces: new[] { "FTPlatform.Web.Mobile.Controllers" }
             );
        }
    }
}