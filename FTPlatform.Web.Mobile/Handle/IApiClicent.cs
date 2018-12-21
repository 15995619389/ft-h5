using FTPlatform.Web.Mobile.Handle.Request;
using FTPlatform.Web.Mobile.Handle.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FTPlatform.Web.Mobile
{
    public interface IApiClicent
    {
        /// <summary>
        /// 执行AOP公开API请求。
        /// </summary>
        /// <typeparam name="T">领域对象</typeparam>
        /// <param name="request">具体的AOP API请求</param>
        /// <returns>领域对象</returns>
        T Execute<T>(IRequest request) where T : ApiResponse;

        string Execute(IRequest request);

        /// <summary>
        /// 执行AOP隐私API请求。
        /// </summary>
        /// <typeparam name="T">领域对象</typeparam>
        /// <param name="request">具体的AOP API请求</param>
        /// <param name="session">用户会话码</param>
        /// <returns>领域对象</returns>
        //T Execute<T>(IRequest<T> request, string session) where T : ApiResponse;

    }
}
