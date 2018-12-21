using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Response
{
    public class ApiLoginResponse: ApiResponse
    {
        public string code { get; set; }

        public string data { get; set; }
    }
}