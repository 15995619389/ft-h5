using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace FTPlatform.Web.Mobile
{
    /// <summary>
    /// 微信 Auth2.0 网页授权登录 Api
    /// </summary>
    public class WechatAuthLogin
    {
        public static string wxAppId = "wxb13f4b2f61528fdd";
        public static string wxAppSecret = "15db1a10921d525a23f530d8e387f814";

        //接口调用频率
        //通过code换取access_token	1万/分钟
        //刷新access_token	        5万/分钟
        //获取用户基本信息	        5万/分钟
        //根据微信开发者平台更新的频率为准

        public static string GetwxLoginUrl(string appid, string redirect_uri, string state, string response_type = "code", string scope = "snsapi_login")
        {
            if (string.IsNullOrWhiteSpace(appid))
                appid = wxAppId;
            return string.Format("https://open.weixin.qq.com/connect/qrconnect?appid={0}&redirect_uri={1}&response_type={2}&scope={3}&state={4}#wechat_redirect", appid, redirect_uri, response_type, scope, state);
        }

        /// <summary>
        /// code 换取 Access_Token
        /// 接口说明
        ///access_token是调用授权关系接口的调用凭证，由于access_token有效期（目前为2个小时）较短，当access_token超时后，可以使用refresh_token进行刷新，access_token刷新结果有两种：
        ///1.若access_token已超时，那么进行refresh_token会获取一个新的access_token，新的超时时间；
        ///2.若access_token未超时，那么进行refresh_token不会改变access_token，但超时时间会刷新，相当于续期access_token。
        /// </summary>
        /// <param name="appid"></param>
        /// <param name="secret"></param>
        /// <param name="code">填写第一步获取的code参数</param>
        /// <param name="grant_type">填authorization_code</param>
        public static wxError<AccessToken> GetAccessTokenByCode(string appid, string secret, string code, string grant_type = "authorization_code")
        {
            wxError<AccessToken> result = new wxError<AccessToken>();
            if (string.IsNullOrWhiteSpace(appid))
                appid = wxAppId;
            if (string.IsNullOrWhiteSpace(secret))
                secret = wxAppSecret;

            string url = string.Format( "https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code={2}&grant_type={3}", appid, secret, code, grant_type);
            string response = "";// WebHelper.Get(url);
            var item = IsSuccess(response);
            if (item.IsSuccess)
            {
                result.Data = JsonConvert.DeserializeObject<AccessToken>(response);
                return result;
            }
            result.errcode = item.errcode;
            result.errmsg = item.errmsg;
            return result;
        }

        /// <summary>
        /// 刷新或续期access_token使用
        /// 接口说明
        ///access_token是调用授权关系接口的调用凭证，由于access_token有效期（目前为2个小时）较短，当access_token超时后，可以使用refresh_token进行刷新，access_token刷新结果有两种：
        ///1. 若access_token已超时，那么进行refresh_token会获取一个新的access_token，新的超时时间；
        ///2.若access_token未超时，那么进行refresh_token不会改变access_token，但超时时间会刷新，相当于续期access_token。
        /// </summary>
        /// <param name="appid">应用唯一标识</param>
        /// <param name="refresh_token">填refresh_token</param>
        /// <param name="grant_type">填写通过access_token获取到的refresh_token参数</param>
        public static wxError<AccessToken> RefreshAccessToken( string appid, string refresh_token, string grant_type = "refresh_token")
        {
            wxError<AccessToken> result = new wxError<AccessToken>();
            if (string.IsNullOrWhiteSpace(appid))
                appid = wxAppId;

            string url = string.Format("https://api.weixin.qq.com/sns/oauth2/refresh_token?appid={0}&grant_type={1}&refresh_token={2}", appid, grant_type, refresh_token);
            string response = "";// WebHelper.Get(url);
            var item = IsSuccess(response);
            if (item.IsSuccess)
            {
                result.Data = JsonConvert.DeserializeObject<AccessToken>(response);
                return result;
            }
            result.errcode = item.errcode;
            result.errmsg = item.errmsg;
            return result;
        }

        /// <summary>
        /// 检验授权凭证（access_token）是否有效
        /// </summary>
        /// <param name="access_token">调用接口凭证</param>
        /// <param name="openid">普通用户标识，对该公众帐号唯一</param>
        public static bool CheckAccessToken(string access_token, string openid)
        {
            string url = string.Format("https://api.weixin.qq.com/sns/auth?access_token={0}&openid={1}", access_token, openid);
            string response = "";// WebHelper.Get(url);
            var item = IsSuccess(response);
            if (item.IsSuccess)
            {
                return true;
            }
            return false;
        }

        public static wxError<wxUserInfo> GetUserInfo(string access_token, string openid, string lang = "zh-CN")
        {
            wxError<wxUserInfo> result = new wxError<wxUserInfo>();
            string url = string.Format("https://api.weixin.qq.com/sns/userinfo?access_token={0}&openid={1}", access_token, openid);
            string response = "";// WebHelper.Get(url);
            var item = IsSuccess(response);
            if (item.IsSuccess)
            {
                result.Data = JsonConvert.DeserializeObject<wxUserInfo>(response);
                return result;
            }
            result.errcode = item.errcode;
            result.errmsg = item.errmsg;
            return result;
        }

        private static wxError IsSuccess(string json)
        {
            if (!string.IsNullOrEmpty(json))
            {
                if (json.IndexOf("errcode") > 0)
                {
                    wxError err = JsonConvert.DeserializeObject<wxError>(json);
                    return err;
                }
                else
                {
                    return new wxError() { errcode = 0, errmsg = "成功" };
                }
            }
            else
            {
                return new wxError { errmsg = "传入的Json字符串为空。", errcode = 10000 };
            }
        }

    }

    public class AccessToken
    {
        /// <summary>
        /// 接口调用凭证
        /// </summary>
        public string access_token { get; set; }

        /// <summary>
        /// access_token接口调用凭证超时时间，单位（秒）
        /// </summary>
        public string expires_in { get; set; }

        /// <summary>
        /// 用户刷新access_token
        /// </summary>
        public string refresh_token { get; set; }

        /// <summary>
        /// 授权用户唯一标识
        /// </summary>
        public string openid { get; set; }

        /// <summary>
        /// 用户授权的作用域，使用逗号（,）分隔

        /// </summary>
        public string scope { get; set; }

    }

    public class wxError
    {
        public bool IsSuccess
        {
            get
            {
                return this.errcode == 0;
            }
        }

        public int errcode { get; set; }

        public string errmsg { get; set; }
    }

    public class wxError<T> : wxError
    {
        public T Data { get; set; }
    }

    public class wxUserInfo
    {
        public string openid { get; set; }
        public string nickname { get; set; }
        public int sex { get; set; }
        public string province { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string headimgurl { get; set; }
        public string privilege { get; set; }
        public string unionid { get; set; }
    }
}