using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;

namespace FTPlatform.Web.Mobile
{
    /// <summary>
    /// 此类主要是用来实现Md5编码。
    /// </summary>
    public class Md5Helper
    {
        /// <summary>
        /// 32位Md5编码
        /// </summary>
        /// <param name="sourceString">原始字符串</param>
        /// <returns>小写32位Md5编码</returns>
        public static string Encrypt(string sourceString)
        {
            StringBuilder stringBuilder = new StringBuilder();
            byte[] bytes = Encoding.Default.GetBytes(sourceString);
            using (MD5 md5 = MD5.Create())
            {
                bytes = md5.ComputeHash(bytes);
            }
            for (int i = 0; i < bytes.Length; i++)
            {
                stringBuilder.Append(bytes[i].ToString("x2"));
            }
            return stringBuilder.ToString();
        }
    }
}
