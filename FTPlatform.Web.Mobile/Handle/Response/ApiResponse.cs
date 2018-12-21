using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FTPlatform.Web.Mobile.Handle.Response
{
    public class ApiResponse
    {
        //[JsonProperty("err_code")]
        public string err_code { get; set; }

        //[JsonProperty("err_msg")]
        public string err_msg { get; set; }

        //public string Body { get; set; }
        //public T data { get; set; }

        //[JsonProperty("iserr")]
        public bool iserr
        {
            get
            {
                return !string.IsNullOrEmpty(this.err_code);
            }
        }
    }
}
