using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Request
{
    public class ApiTokenRequest : IRequest
    {
        public string appId { get; set; }

        public string appSecret { get; set; }

        public string nonce { get; set; }

        public string clientIp { get; set; }

        public string clientSession { get; set; }

        public IDictionary<string, string> GetParameters()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("appId", this.appId);
            dic.Add("appSecret", this.appSecret);
            dic.Add("nonce", this.nonce);
            dic.Add("clientIp", this.clientIp);
            dic.Add("clientSession", this.clientSession);
            return dic;
        }
    }

    public class ApiRefreshTokenRequest : IRequest
    {
        public string refreshToken { get; set; }

        public string clientIp { get; set; }

        public string clientSession { get; set; }

        public IDictionary<string, string> GetParameters()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("refreshToken", this.refreshToken);
            dic.Add("clientIp", this.clientIp);
            return dic;
        }
    }
}