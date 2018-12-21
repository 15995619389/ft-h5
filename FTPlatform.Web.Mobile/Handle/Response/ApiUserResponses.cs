using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Response
{
    public class ApiGetUserByWxResponse : ApiResponse
    {
        public string UserName { get; set; }

        public string Mobile { get; set; }

        public string CreateDate { get; set; }
    }

    public class ApiBingWechatResponse : ApiResponse
    {
        public string UserName { get; set; }

        public string Mobile { get; set; }

        public string CreateDate { get; set; }
    }
}