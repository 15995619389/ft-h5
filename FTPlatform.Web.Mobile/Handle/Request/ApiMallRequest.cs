using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Request
{
    public class ApiMallRequest : IRequest
    {
        //public Dictionary<string, string> sPara { get; set; }
        public string ReqStr { get; set; }

        public IDictionary<string, string> GetParameters()
        {
            var diy = new Dictionary<string, string>();
            diy.Add("ReqStr", this.ReqStr);
            return diy;
        }
    }
}