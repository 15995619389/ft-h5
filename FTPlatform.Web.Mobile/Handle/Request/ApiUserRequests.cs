using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Request
{
    public class ApiGetUserByWxCodeRequest : IRequest
    {
        public string Code { get; set; }

        public IDictionary<string, string> GetParameters()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("code", this.Code);
            return dic;
        }
    }

    public class ApiBindWechatRequest : IRequest
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public string ThirdID { get; set; }

        public IDictionary<string, string> GetParameters()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("UserName", this.UserName);
            dic.Add("Password", this.Password);
            dic.Add("ThirdID", this.ThirdID);
            return dic;
        }
    }
}