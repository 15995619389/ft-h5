using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;

namespace FTPlatform.Web.Mobile.Handle.Extention
{
    public class WebHelperEx
    {
        #region POST 请求：Post


        /// <summary>
        /// 发起POST请求
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="contentType"></param>
        /// <param name="postData">传入请求数据</param>
        /// <param name="cookie">Cookie值</param>
        /// <param name="cert">证书路径，绝对路径</param>
        /// <param name="certPwd">证书密码</param>
        /// <returns>返回的数据</returns>
        /// <remarks>如果有证书，服务器端在IIS程序池高级设置中设置加载用户配置文件为True</remarks>
        public static string Post(string url, string contentType = null, string postData = null, Cookie cookie = null, string cert = null, string certPwd = null, Dictionary<string,string> headers = null)
        {
            var rsp = PostR(url, contentType, postData, cookie, cert, certPwd, headers);
            return GetResponseData(rsp);
        }

        /// <summary>
        /// 发起POST请求
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="contentType"></param>
        /// <param name="postData">传入请求数据</param>
        /// <param name="cookie">Cookie值</param>
        /// <param name="cert">证书路径，绝对路径</param>
        /// <param name="certPwd">证书密码</param>
        /// <returns>返回的响应</returns>
        /// <remarks>如果有证书，服务器端在IIS程序池高级设置中设置加载用户配置文件为True</remarks>
        public static WebResponse PostR(string url, string contentType = null, string postData = null,
            Cookie cookie = null, string cert = null, string certPwd = null, Dictionary<string, string> headers = null)
        {
            var webRequest = HttpWebRequest.Create(url) as HttpWebRequest;
            webRequest.UserAgent = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)";
            webRequest.Method = "POST";
            //webRequest.ServicePoint.Expect100Continue = false;
            webRequest.Timeout = 20000;
            //webRequest.KeepAlive = true;
            if (cookie != null)
            {
                webRequest.CookieContainer = new CookieContainer();
                webRequest.CookieContainer.Add(cookie);
            }
            if (string.IsNullOrEmpty(contentType))
            {
                webRequest.ContentType = "application/x-www-form-urlencoded";
            }
            else
            {
                webRequest.ContentType = contentType;
            }
            if (!string.IsNullOrWhiteSpace(cert) && !string.IsNullOrWhiteSpace(certPwd))
            {
                ServicePointManager.ServerCertificateValidationCallback = CheckValidationResult;
                var cer = new X509Certificate(cert, certPwd);
                webRequest.ClientCertificates.Add(cer);
            }
            if (headers != null && headers.Count > 0)
            {
                foreach (var item in headers)
                {
                    webRequest.Headers[item.Key] = item.Value;
                }
            }
            if (!string.IsNullOrEmpty(postData))
            {
                StreamWriter requestWriter = null;
                requestWriter = new StreamWriter(webRequest.GetRequestStream());
                try
                {
                    requestWriter.Write(postData);
                }
                catch (System.Exception e)
                {
                    throw e;
                }
                finally
                {
                    requestWriter.Close();
                    requestWriter.Dispose();
                }
            }
            return webRequest.GetResponse();
        }

        /// <summary>
        /// 获取响应的字符串数据
        /// </summary>
        /// <param name="response">响应</param>
        /// <returns></returns>
        private static string GetResponseData(WebResponse response)
        {
            StreamReader responseReader = null;
            string responseData = "";
            try
            {
                responseReader = new StreamReader(response.GetResponseStream());
                responseData = responseReader.ReadToEnd();
            }
            catch (System.Exception e)
            {
                throw e;
            }
            finally
            {
                if (responseReader != null)
                {
                    responseReader.Close();
                    responseReader.Dispose();
                }
            }
            return responseData;
        }

        /*CheckValidationResult的定义*/
        private static bool CheckValidationResult(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors errors)
        {
            if (errors == SslPolicyErrors.None)
                return true;
            return false;
        }


        #endregion
    }
}