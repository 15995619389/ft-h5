using FTPlatform.Web.Mobile.Handle.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Request
{
    public class ApiTokenResponse<T> : ApiResponse
    {
        public T data { get; set; }

        //public string access_token { get; set; }
    }

    public class ApiRefreshTokenResponse : ApiResponse
    {

    }
}