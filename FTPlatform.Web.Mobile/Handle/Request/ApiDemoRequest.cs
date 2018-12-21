using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Request
{
    /// <summary>
    /// 接口请求的参数模型
    /// </summary>
    public class ApiDemoRequest : IRequest //<ApiDemoResponse>
    {
        public string demopara1 { get; set; }

        public string demopara2 { get; set; }

        public string demopara3 { get; set; }

        /// <summary>
        /// 为请求的参数实例化 键值对 对象
        /// </summary>
        /// <returns></returns>
        public IDictionary<string, string> GetParameters()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("demopara1", this.demopara1);
            dic.Add("demopara2", this.demopara2);
            dic.Add("demopara3", this.demopara3);
            return dic;
        }
    }
}