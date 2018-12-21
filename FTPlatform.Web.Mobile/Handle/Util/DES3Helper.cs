using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace FTPlatform.Web.Mobile
{
    public static class DES3Helper
    {
        /// <summary>
        /// 加密
        /// </summary>
        /// <param name="encoding"></param>
        /// <param name="encryptSource"></param>
        /// <param name="encryptKey"></param>
        /// <param name="encryptIV"></param>
        /// <param name="chpherMode"></param>
        /// <param name="paddingMode"></param>
        /// <param name="byteNum"></param>
        /// <param name="outType"></param>
        /// <returns></returns>
        public static string TripleDESEncrypt(Encoding encoding, string encryptSource, string encryptKey, string encryptIV, CipherMode chpherMode, PaddingMode paddingMode, int byteNum, string outType)
        {
            if (string.IsNullOrEmpty(outType))
            {
                throw new System.Exception("输出配置不能空");
            }
            if (encryptKey.Trim().Length != byteNum)
            {
                throw new System.Exception("密钥字节长度不对");
            }
            string result;
            try
            {
                SymmetricAlgorithm symmetricAlgorithm = new TripleDESCryptoServiceProvider();
                byte[] bytes = encoding.GetBytes(encryptKey);
                symmetricAlgorithm.Key = bytes;
                if (string.IsNullOrEmpty(encryptIV))
                {
                    encryptIV = encryptKey.Substring(0, 8);
                }
                symmetricAlgorithm.IV = encoding.GetBytes(encryptIV);
                symmetricAlgorithm.Mode = chpherMode;
                symmetricAlgorithm.Padding = paddingMode;
                ICryptoTransform transform = symmetricAlgorithm.CreateEncryptor(symmetricAlgorithm.Key, symmetricAlgorithm.IV);
                byte[] bytes2 = encoding.GetBytes(encryptSource.Trim());
                string text = string.Empty;
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    CryptoStream cryptoStream = new CryptoStream(memoryStream, transform, CryptoStreamMode.Write);
                    cryptoStream.Write(bytes2, 0, bytes2.Length);
                    cryptoStream.FlushFinalBlock();
                    cryptoStream.Close();
                    if (outType == "ToHex16")
                    {

                        text = ""; // StringUtils.ToHexString(memoryStream.ToArray());
                    }
                    if (outType == "ToBase64")
                    {
                        text = Convert.ToBase64String(memoryStream.ToArray()).ToString().Replace("\0", "");
                    }
                }
                result = text;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception("TripleDES加密发生错误,原因：" + ex.Message, ex);
            }
            return result;
        }


        public static string TripleDESDecrypt(string key, string data)
        {
            TripleDESCryptoServiceProvider DES = new TripleDESCryptoServiceProvider();

            DES.Key = ASCIIEncoding.UTF8.GetBytes(key);
            DES.Mode = CipherMode.ECB;
            DES.Padding = System.Security.Cryptography.PaddingMode.Zeros;

            ICryptoTransform DESDecrypt = DES.CreateDecryptor();

            string result = "";
            try
            {
                byte[] Buffer = Convert.FromBase64String(data);
                result = ASCIIEncoding.UTF8.GetString(DESDecrypt.TransformFinalBlock(Buffer, 0, Buffer.Length));
            }
            catch
            {

            }
            return result;
        }

        public static string NoHTML(this string strHtml)
        {
            if (string.IsNullOrWhiteSpace(strHtml))
                return strHtml;

            Match m = null;
            Regex r = new Regex(@"<\/?[^>]*>", RegexOptions.IgnoreCase);
            for (m = r.Match(strHtml); m.Success; m = m.NextMatch())
            {
                strHtml = strHtml.Replace(m.Groups[0].ToString(), "");
            }

            return strHtml;
        }

        public static string GetHash(this string input)
        {
            HashAlgorithm hashAlgorithm = new SHA256CryptoServiceProvider();

            byte[] byteValue = System.Text.Encoding.UTF8.GetBytes(input);

            byte[] byteHash = hashAlgorithm.ComputeHash(byteValue);

            return Convert.ToBase64String(byteHash);
        }

        /// <summary>  
        /// 获取时间戳  
        /// </summary>  
        /// <returns></returns>  
        public static string GetTimeStamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalSeconds).ToString();
        }

        public static DateTime GetDateTime(long timestamp)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1)); // 当地时区
            DateTime dt = startTime.AddSeconds(timestamp);
            return dt;
        }
    }
}