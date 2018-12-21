using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Response
{
    /// <summary>
    /// 定义接口反馈的数据模型，并继承错误模型 
    /// </summary>
    public class ApiDemoResponse:ApiResponse
    {
        public string para { get; set; }
    }
}