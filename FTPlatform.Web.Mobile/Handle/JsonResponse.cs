using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle
{
    public class JsonResponse<T>
    {
        public JsonResponse()
        {
        }

        public JsonResponse(int status, string msg = "")
        {
            this.StateCode = status;
            this.StateExplain = msg;
        }

        /// <summary>
        /// 状态码
        /// </summary>
        public int StateCode { get; set; }

        /// <summary>
        /// 提示信息
        /// </summary>
        public string StateExplain { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public T DataObj { get; set; }

    }
}