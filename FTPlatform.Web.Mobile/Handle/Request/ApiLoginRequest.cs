using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Request
{
    public class ApiLoginRequest : IRequest//<ApiLoginResponse>
    {
        public string Mobile { get; set; }

        public string PassWord { get; set; }

        public bool RememberMe { get; set; }

        //防机器
        public string afs_scene { get; set; }
        public string afs_token { get; set; }

        //滑动验证
        public string csessionid { get; set; }
        public string sig { get; set; }
        public string token { get; set; }
        public string scene { get; set; }

        public IDictionary<string, string> GetParameters()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("Mobile", this.Mobile);
            dic.Add("PassWord", this.PassWord);
            //dic.Add("RememberMe", this.RememberMe);
            dic.Add("afs_scene", this.afs_scene);
            dic.Add("afs_token", this.afs_token);
            dic.Add("csessionid", this.csessionid);
            dic.Add("sig", this.sig);
            dic.Add("token", this.token);
            dic.Add("scene", this.scene);
            return dic;
        }
    }
}