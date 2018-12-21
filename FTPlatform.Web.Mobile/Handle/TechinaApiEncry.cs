using System.Text;

namespace FTPlatform.Web.Mobile
{
    public class TechinaApiEncry
    {
        public static string CreateApiToken(string seed)
        {
            return Md5Helper.Encrypt("md5techina2025" + "/" + seed);
        }

        public static string CreateApiSeed()
        {
            string timestamp = CommonEx.GetTimeStamp();
            string nonce = "123456789";
            string echostr = "liwenbingliwenbing";

            string desPass = DES3Helper.TripleDESEncrypt(Encoding.UTF8, string.Format("{0}:{1}:{2}", timestamp, nonce, echostr), "destechina20250000000000", "", System.Security.Cryptography.CipherMode.ECB, System.Security.Cryptography.PaddingMode.Zeros, 24, "ToBase64");

            return desPass;
        }
    }
}