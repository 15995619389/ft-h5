using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Request
{
    public interface IRequest //<T> //where T : ApiResponse
    {
        /// <summary>
        /// 获取参数
        /// </summary>
        /// <returns></returns>
        IDictionary<string, string> GetParameters();
    }
}