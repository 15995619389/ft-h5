using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace FTPlatform.Web.Mobile
{
    public class WebHelper
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
        public static string Post(string url, string contentType = null, string postData = null, Cookie cookie = null, string cert = null, string certPwd = null)
        {
            var rsp = PostR(url, contentType, postData, cookie, cert, certPwd);
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
            Cookie cookie = null, string cert = null, string certPwd = null)
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

        ///<summary>
        /// 请求的公共类用来向服务器发送请求
        ///</summary>
        ///<param name="strSMSRequest">发送请求的字符串</param>
        ///<returns>返回的是请求的信息</returns>
        public static string Post(string url, int port, string postData)
        {
            byte[] data = new byte[1024];
            string stringData = null;
            IPHostEntry gist = Dns.GetHostByName(url);
            IPAddress ip = gist.AddressList[0];
            //得到IP 
            IPEndPoint ipEnd = new IPEndPoint(ip, port);
            //默认80端口号 
            Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            //使用tcp协议 stream类型 
            try
            {
                socket.Connect(ipEnd);
            }
            catch (SocketException ex)
            {
                throw new System.Exception("Fail to connect server\r\n" + ex.ToString());
            }
            StringBuilder buf = new StringBuilder();
            buf.Append(postData);
            //buf.Append("GET ").Append(path).Append(" HTTP/1.0\r\n");
            //buf.Append("Content-Type: application/x-www-form-urlencoded\r\n");
            //buf.Append("\r\n");
            byte[] ms = System.Text.UTF8Encoding.UTF8.GetBytes(buf.ToString());
            //提交请求的信息
            socket.Send(ms);
            //接收返回 
            string strSms = "";
            int recv = 0;
            do
            {
                recv = socket.Receive(data);
                stringData = Encoding.UTF8.GetString(data, 0, recv);
                //如果请求的页面meta中指定了页面的encoding为gb2312则需要使用对应的Encoding来对字节进行转换() 
                strSms = strSms + stringData;
                //strSms += recv.ToString();
            }
            while (recv != 0);
            socket.Shutdown(SocketShutdown.Both);
            socket.Close();
            return strSms;
        }

        #endregion

        #region GET 请求：Get

        /// <summary>
        /// 执行HTTP GET请求
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="encoding">编码，为 null 则为默认编码</param>
        /// <returns>HTTP响应</returns>
        /// <exception cref="ArgumentNullException">Url为空时抛出异常ArgumentNullException</exception>
        /// <exception cref="Exception">异常Exception</exception>
        public static string Get(string url, Encoding encoding = null)
        {
            string result = string.Empty;
            if (String.IsNullOrEmpty(url))
            {
                throw new ArgumentNullException("Url不能为空！");
            }
            try
            {
                var webRequest = WebRequest.Create(url) as HttpWebRequest;
                webRequest.Method = "GET";
                webRequest.ServicePoint.Expect100Continue = false;
                webRequest.KeepAlive = true;
                var rsp = (HttpWebResponse)webRequest.GetResponse();
                if (rsp.ContentType.Contains("image"))
                {
                    throw new System.Exception("请求资源格式不是文本格式！");
                }
                return GetResponseData(rsp);
            }
            catch (System.Exception ex)
            {
                throw new System.Exception("GET请求发生异常：" + ex.Message);
            }
        }

        /// <summary>
        /// 执行HTTP GET请求
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="encoding">编码，为 null 则为默认编码</param>
        /// <returns>HTTP响应</returns>
        /// <exception cref="ArgumentNullException">Url为空时抛出异常ArgumentNullException</exception>
        /// <exception cref="Exception">异常Exception</exception>
        public static HttpWebResponse GetResponse(string url, Encoding encoding = null)
        {
            string result = string.Empty;
            if (String.IsNullOrEmpty(url))
            {
                throw new ArgumentNullException("Url不能为空！");
            }
            try
            {
                var webRequest = WebRequest.Create(url) as HttpWebRequest;
                webRequest.Method = "GET";
                webRequest.ServicePoint.Expect100Continue = false;
                webRequest.KeepAlive = true;
                var rsp = (HttpWebResponse)webRequest.GetResponse();
                return rsp;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception("GET请求发生异常：" + ex.Message);
            }
        }

        #endregion

        #region 获取客户端真实IP地址 ： GetClientIp

        /// <summary>
        /// 获取客户端真实IP地址
        /// </summary>
        /// <returns>string</returns>
        public static string GetClientIp()
        {
            return GetClientIp(HttpContext.Current.Request);
        }

        /// <summary>
        /// 获取指定请求的真实IP地址
        /// </summary>
        /// <returns>string</returns>
        public static string GetClientIp(HttpRequest request)
        {
            string result = request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if ((result + "").Length == 0)
                result = request.ServerVariables["REMOTE_ADDR"];

            if ((result + "").Length == 0)
                result = request.UserHostAddress;
            return result;
        }

        /// <summary>
        /// 获取指定请求的真实IP地址
        /// </summary>
        /// <returns>string</returns>
        public static string GetClientIp(HttpRequestBase request)
        {
            string result = request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if ((result + "").Length == 0)
                result = request.ServerVariables["REMOTE_ADDR"];

            if ((result + "").Length == 0)
                result = request.UserHostAddress;
            return result;
        }

        #endregion
    }
}
