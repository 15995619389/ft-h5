using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FTPlatform.Web.Mobile
{
    public class LoginViewModel
    {
        [Required]
        [Display(Name = "用户名")]
        [RegularExpression(@"^1(3|4|5|6|7|8)\d{9}$", ErrorMessage = "手机号码有误，请重新输入.")]
        public string Mobile { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "密码")]
        public string PassWord { get; set; }

        [Display(Name = "记住我?")]
        public bool RememberMe { get; set; }

        //防机器
        public string afs_scene { get; set; }
        public string afs_token { get; set; }

        //滑动验证
        public string csessionid { get; set; }
        public string sig { get; set; }
        public string token { get; set; }
        public string scene { get; set; }

    }

    public class RegisterViewModel
    {
        [Required]
        [Display(Name = "用户名")]
        [RegularExpression(@"^1(3|4|5|6|7|8)\d{9}$", ErrorMessage = "手机号码有误，请重新输入.")]
        public string Mobile { get; set; }

        [Required]
        [Display(Name ="验证码")]
        [StringLength(6)]
        [MaxLength(6)]

        public string Code { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "密码长度须6位字符以上")]
        [MaxLength(16, ErrorMessage = "密码长度须少于16位字符")]
        [Display(Name = "密码")]
        [RegularExpression(@"(?=.*\d)(?=.*[a-zA-Z]).{6,16}", ErrorMessage = "请至少设置两种字符(英文字母、数字)组合，不允许使用特殊符号，如:~!@#$%^&*")] //(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}
        public string Password { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(16)]
        [Compare("Password", ErrorMessage = "两次输入的密码不一致.")]
        [Display(Name = "确认密码")]
        public string ConfirmPwd { get; set; }

        [Required]
        public int UserType { get; set; }

        [MaxLength(50)]
        public string Referee { get; set; }

        public bool IsAgreeProtocol { get; set; }

        //防机器
        public string afs_scene { get; set; }

        public string afs_token { get; set; }

        //滑动验证
        public string csessionid { get; set; }
        public string sig { get; set; }
        public string token { get; set; }
        public string scene { get; set; }


    }

    public class FindPassWord
    {
        [Required]
        [RegularExpression(@"^1(3|4|5|6|7|8)\d{9}$", ErrorMessage = "用户名格式有误，请输入注册时使用的手机号码.")]
        [Display(Name = "用户名称")]
        public string username { get; set; }

        public string csessionid { get; set; }
        public string sig { get; set; }
        public string token { get; set; }
        public string scene { get; set; }

    }

    public class FindValidMobile
    {
        [Required]
        [Display(Name = "手机")]
        public string Mobile { get; set; }

        //[Display(Name = "邮箱")]
        //public string Email { get; set; }

        [Required]
        [Display(Name = "验证码")]
        public string VerifCode { get; set; }

        public string Mark { get; set; }
    }

    public class FindValidEmail
    {
        [Required]
        [Display(Name = "邮箱")]
        public string EMail { get; set; }

        [Required]
        [Display(Name = "验证码")]
        public string VerifCode { get; set; }

        public string Mark { get; set; }
    }

    public class FindModifyPwd
    {
        [Display(Name = "密码")]
        [Required]
        [MinLength(6)]
        [MaxLength(16)]
        [RegularExpression(@"(?=.*\d)(?=.*[a-zA-Z]).{6,16}", ErrorMessage = "请至少设置两种字符(英文字母、数字)组合，不允许使用特殊符号，如:~!@#$%^&*")] //(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}
        public string Password { get; set; }

        [Display(Name = "密码")]
        [MinLength(6)]
        [MaxLength(16)]
        [Compare("Password", ErrorMessage = "两次输入的密码不一致.")]
        public string Password1 { get; set; }
    }

    #region 会员中心

    public class ModifyPwd
    {
        [Required(ErrorMessage = "请输入正在使用的密码.")]
        [MinLength(6, ErrorMessage = "密码长度应不低于6位中英文字符.")]
        [MaxLength(18, ErrorMessage = "密码长度应不高于18位中英文字符.")]
        public string oldpass { get; set; }

        [Required(ErrorMessage = "请输入您的新密码.")]
        [MinLength(6, ErrorMessage = "密码长度应不低于6位中英文字符.")]
        [MaxLength(18, ErrorMessage = "密码长度应不高于18位中英文字符.")]
        [RegularExpression(@"(?=.*\d)(?=.*[a-zA-Z]).{6,16}", ErrorMessage = "密码请设置两种字符(英文字母、数字)组合，不允许使用特殊符号，如:~!@#$%^&*")] //(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}
        public string newpass { get; set; }

        [Required(ErrorMessage = "请再次输入您的新密码.")]
        [MinLength(6, ErrorMessage = "密码长度应不低于6位中英文字符.")]
        [MaxLength(18, ErrorMessage = "密码长度应不高于18位中英文字符.")]
        [Compare("newpass", ErrorMessage = "两次输入的密码不一致.")]
        public string newpass1 { get; set; }

    }

    public class AddBankCard
    {
        /// <summary>
        /// 验证码
        /// </summary>
        [Display(Name = "验证码")]
        [Required(ErrorMessage = "请输入验证码.")]
        public string VerCode { get; set; }

        /// <summary>
        /// 联系方式确认
        /// </summary>
        [StringLength(18)]
        public string VerContact { get; set; }

        /// <summary>
        /// 开户名
        /// </summary>
        [Display(Name = "银行开户名")]
        [Required(ErrorMessage = "请输入开户名.")]
        [MaxLength(20)]
        public string AccountName { get; set; }

        /// <summary>
        /// 银行卡号
        /// </summary>
        [Display(Name = "银行卡号")]
        [Required]
        [MaxLength(18)]
        [MinLength(12)]
        [RegularExpression(@"^\d{12,18}$", ErrorMessage = "银行卡号不合法.")]
        public string AccountCardNo { get; set; }

        /// <summary>
        /// 开户行
        /// </summary>
        [Display(Name = "开户行")]
        [Required]
        [MaxLength(50)]
        public string AccountBank { get; set; }

        /// <summary>
        /// 开户支行
        /// </summary>
        [Display(Name = "开户支行")]
        [StringLength(100)]
        public string AccountSubbranch { get; set; }

        /// <summary>
        /// 预留手机
        /// </summary>
        [StringLength(18)]
        public string ReservedMobile { get; set; }
    }

    public class ApplyCompany
    {
        [Required(ErrorMessage = "请输入企业名称.")]
        [StringLength(100, ErrorMessage = "企业名称的字符长度超出限制.")]
        public string Name { get; set; }

        [Display(Name = "注册资金")]
        [Required(ErrorMessage = "请输入企业注册资金.")]
        //[MaxLength(12)]
        public decimal RegisterCapital { get; set;}

        public DateTime? RegisterTime { get; set; }

        [StringLength(100)]
        public string Address { get; set; }

        [StringLength(50)]
        public string Position { get; set; }

    }

    public class ModifyBaseInfo
    {
        public string RealName { get; set; }

        public string CallPhone { get; set; }

        public string CompanyName { get; set; }

        public string BusinessCategory { get; set; }

        public string AvatarUrl { get; set; }
    }

    public class ModifyCompanyBaseInfo
    {
        [Display(Name = "真实姓名")]
        [StringLength(50)]
        public string RealName { get; set; }

        [Display(Name = "企业名称")]
        [MaxLength(50)]
        public string CompanyName { get; set; }

        [Display(Name = "电话号码")]
        [RegularExpression(@"((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)", ErrorMessage = "电话号码格式不正确.")]
        [MaxLength(24)]
        public string CallPhone { get; set; }

        [Display(Name = "涉及行业")]
        [MaxLength(500)]
        public string BusinessCategory { get; set; }

        [Display(Name = "职位")]
        [StringLength(50)]
        public string Position { get; set; }

        public string AvatarUrl { get; set; }

        [Display(Name = "注册时间")]
        public DateTime? RegisterTime { get; set; }

        [Display(Name = "企业地址")]
        [StringLength(200)]
        public string Address { get; set; }

        [Display(Name = "注册资本")]
        public decimal RegisterCapital { get; set; }

        [Display(Name = "邮箱")]
        [RegularExpression(@"^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-zA-Z0-9]+$", ErrorMessage = "邮箱格式不正确.")]
        [MaxLength(30)]
        public string Email { get; set; }

        public string BusCates { get; set; }

    }

    public class CarteHeadModel
    {
        /// <summary>
        /// 已接收
        /// </summary>
        public int Received { get; set; }

        /// <summary>
        /// 待确定
        /// </summary>
        public int Confirmed { get; set; }

        /// <summary>
        /// 已发
        /// </summary>
        public int Sended { get; set; }

        /// <summary>
        /// 拒收
        /// </summary>
        public int Rejected { get; set; }

        /// <summary>
        /// 接收详情
        /// </summary>
        //public List<UserCarteExchangeModel> Receiveds { get; set; }

    }

    public class CarteModify
    {
        [StringLength(1000)]
        public string Signature { get; set; }

        [StringLength(1000)]
        public string BusinessScope { get; set; }
    }

    public class CarteListModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Buss { get; set; }

        public int UserType { get; set; }

        public int Status { get; set; }

        public DateTime CreateTime { get; set; }

        public bool IsNeed { get; set; }

        public bool IsSupply { get; set; }
    }

    public class BusCateJson
    {
        public BusCateJson()
        {
            this.first = new BusCateModel();
            this.second = new BusCateModel();
            this.third = new BusCateModel();
        }

        public BusCateModel first { get; set; }

        public BusCateModel second { get; set; }

        public BusCateModel third { get; set; }

        public string strJson { get; set; }
    }

    public class BusCateModel
    {
        public string id { get; set; }

        public string name { get; set; }
    }

    public class ModifyMobile
    {
        [Display(Name = "新手机号" )]
        [Required]
        [RegularExpression(@"^1(3|4|5|6|7|8)\d{9}$", ErrorMessage = "手机号码有误，请重新输入.")]
        public string NewMobile { get; set; }

        [Display(Name = "验证码")]
        [Required]
        public string VerCode { get; set; }

        [Display(Name = "密码")]
        [Required]
        public string Password { get; set; }
    }

    #endregion
}