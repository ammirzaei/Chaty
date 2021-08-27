using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Chaty.Core.ViewModels;
using Chaty.Data.Entity;

namespace Chaty.Core.Interfaces
{
    public interface IChats
    {
        Task<IEnumerable<AllChatsViewModel>> GetAllChats(string userID);
        Task<AllChatsViewModel> GetChats(string chatID, string userID);
        Task<IEnumerable<AllCommentsViewModel>> GetAllComments(string userID, string chatID);
        Task<ChatComments> AddComment(AddCommentViewModel commentModel,string userId);
        Task<bool> DeleteComment(string commentId, string userId);
        Task<bool> EditComment(EditCommentViewModel commentModel, string userId);
        Task<ChatComments> GetComment(string commentID);
        Task ChangeSeenComment(string commentId);
        Task ChangeSeenAllComment(string chatID, string userID);
        Task DeleteHistory(string chatId, string userId);
        Task<bool> ExistUserInChat(string chatID, string userId);
        Task DeleteChat(string chatId, string userId);
        Task<List<ProfileInfoSearchViewModel>> GetResaultSearchAddUser(string chatID, string userID ,string mobile);
        Task AddUserToGroup(string chatID, List<string> listUserId);
        Task ExitGroup(string chatID, string userID);
        Task EditNameGroup(string chatID, string title, string userID);
        Task<ProfileViewModel> GetProfileUser(string ID, string userID);
        Task<ProfileGroupViewModel> GetProfileGroup(string chatID, string UserId);
    }
}
