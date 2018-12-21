using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Text;
using FTPlatform.Web.Mobile;
using FTPlatform.Web.Mobile.Handle.Request;
using System.Configuration;
using FTPlatform.Web.Mobile.Handle.Response;
using Newtonsoft.Json;
//using FTPlatform.Web.Common;
using FTPlatform.Web.Mobile.Handle.Extention;

namespace FTPlatform.Web.Mobile
{
    public class ApiClicent: IApiClicent
    {
        public string ApiUrl = ConfigurationManager.AppSettings["WebApiUrl"];

        public static string md5_key = "md5techina2025";
        public static string rsa_key = "techina2025";
        public static string des3_key = "destechina20250000000000";

        private string serverUrl;
        private string version;
        private string type = "post";
        private bool isExpressly = false;

        /// <summary>
        /// api 请求
        /// </summary>
        /// <param name="sererurl">服务地址</param>
        /// <param name="isexpre">是否包含明文传输</param>
        /// <param name="type">参数类型</param>
        public ApiClicent(string sererurl, bool isexpre = false, string type = "post")
        {
            this.serverUrl = sererurl;
            this.type = type;
            this.isExpressly = isexpre;
        }

        public T Execute<T>(IRequest request) where T : ApiResponse
        {
            IDictionary<string, string> parass = request.GetParameters();
            string body = GetRequestParasToString(parass);

            body = DES3Helper.TripleDESEncrypt(Encoding.UTF8, body, des3_key, "", System.Security.Cryptography.CipherMode.ECB, System.Security.Cryptography.PaddingMode.Zeros, 24, "ToBase64");
            //添加签名参数
            
            IDictionary <string, string> paras = new Dictionary<string, string>();
            if (this.isExpressly)
            {
                paras = parass;
            }

            string timestamp = CommonEx.GetTimeStamp();

            paras.Add("token", Md5Helper.Encrypt(md5_key + timestamp + "/" + body));
            paras.Add("seed", timestamp);
            paras.Add("verion", "1.0.0");
            paras.Add("body", body);

            string url = this.ApiUrl + this.serverUrl;
            string strPara = JsonConvert.SerializeObject(paras);
            string content = string.Empty;
            if (this.type == "post")
            {
                Dictionary<string, string> headers = new Dictionary<string, string>();
                var Seed = TechinaApiEncry.CreateApiSeed();
                headers.Add("seed", Seed);
                headers.Add("token", TechinaApiEncry.CreateApiToken(Seed));
                content = WebHelperEx.Post(url, "application/json", strPara, null, null, null, headers);
            }
            else
            {
                string urlpara = this.GetRequestParas(url, paras);
                content = WebHelper.Get(urlpara);
            }

            try
            {
                return JsonConvert.DeserializeObject<T>(content);
            }
            catch
            {
                //throw ex;
                return null;
            }
            
        }

        public string Execute(IRequest request)
        {
            IDictionary<string, string> parass = request.GetParameters();
            string body = GetRequestParasToString(parass);

            body = DES3Helper.TripleDESEncrypt(Encoding.UTF8, body, des3_key, "", System.Security.Cryptography.CipherMode.ECB, System.Security.Cryptography.PaddingMode.Zeros, 24, "ToBase64");
            //添加签名参数

            IDictionary<string, string> paras = new Dictionary<string, string>();
            if (this.isExpressly)
            {
                paras = parass;
            }

            string timestamp = CommonEx.GetTimeStamp();

            paras.Add("token", Md5Helper.Encrypt(md5_key + timestamp + "/" + body));
            paras.Add("seed", timestamp);
            paras.Add("verion", "1.0.0");
            paras.Add("body", body);

            string url = this.ApiUrl + this.serverUrl;
            string strPara = JsonConvert.SerializeObject(paras);
            string content = string.Empty;
            if (this.type == "post")
            {
                Dictionary<string, string> headers = new Dictionary<string, string>();
                var Seed = TechinaApiEncry.CreateApiSeed();
                headers.Add("seed", Seed);
                headers.Add("token", TechinaApiEncry.CreateApiToken(Seed));
                content = WebHelperEx.Post(url, "application/json", strPara, null, null, null, headers);
            }
            else
            {
                string urlpara = this.GetRequestParas(url, paras);
                content = WebHelper.Get(urlpara);
            }

            try
            {
                return content;
            }
            catch
            {
                return null;
            }

        }

        private String GetRequestParas(String url, IDictionary<String, String> dic)
        {
            if (dic.Count == 0)
                return url;

            String str = url + "/";
            foreach (var item in dic)
            {
                str += item.Key + "=" + item.Value + "&";
            }
            return str.Substring(0, str.Length - 1);
        }

        private String GetRequestParasToString(IDictionary<String, String> dic)
        {
            String str = string.Empty;
            foreach (var item in dic)
            {
                str += item.Key + "=" + item.Value + "&";
            }
            return str.Substring(0, str.Length - 1);
        }
    }
}