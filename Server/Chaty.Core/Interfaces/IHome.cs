using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Chaty.Core.ViewModels;

namespace Chaty.Core.Interfaces
{
    public interface IHome
    {
        Task<IEnumerable<ProfileInfoSearchViewModel>> GetResultSearchNewComment(string mobile, string userID);
        Task<AllChatsViewModel> StartContact(List<string> usersIdTarget, string userIdMe);
        Task<bool> ExistContact(string UserIdMe, List<string> UserIdTarget);
    }
}
