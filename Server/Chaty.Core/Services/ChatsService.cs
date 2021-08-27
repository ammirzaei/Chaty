using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Chaty.Core.Classes;
using Chaty.Core.Interfaces;
using Chaty.Core.ViewModels;
using Chaty.Data.Context;
using Chaty.Data.Entity;
using Microsoft.EntityFrameworkCore;

namespace Chaty.Core.Services
{
    public class ChatsService : IChats
    {
        private readonly ChatyContext db;
        private readonly IProfile _IProfile;

        public ChatsService(ChatyContext db, IProfile iProfile)
        {
            this.db = db;
            _IProfile = iProfile;
        }

        public async Task<IEnumerable<AllChatsViewModel>> GetAllChats(string userID)
        {
            List<AllChatsViewModel> List = new List<AllChatsViewModel>();
            foreach (var item in db.ChatUsers.Include(s => s.Chats).Where(s => s.UserID == userID && s.IsExit == false).OrderByDescending(s => s.ChatComments.Max(a => a.CreateDate)))
            {
                List.Add(await GetChats(item.ChatID, userID));
            }
            return await Task.FromResult(List);
        }

        public async Task<AllChatsViewModel> GetChats(string chatID, string userID)
        {
            var chat = await db.Chats.FindAsync(chatID);
            int countNoSee = await db.ChatComments.Where(s => s.IsSee == false && s.ChatUsers.ChatID == chatID && s.ChatUsers.UserID != userID)
                .CountAsync();
            if (chat.Title != null)
            {
                return await Task.FromResult(new AllChatsViewModel()
                {
                    Title = chat.Title,
                    ChatID = chatID,
                    Image = await _IProfile.GetImageNameChatGroup(chatID, true),
                    CountNoSee = countNoSee,
                    Method = "Group"
                });
            }
            else
            {
                var Userid = db.ChatUsers.FirstOrDefaultAsync(s => s.ChatID == chatID && s.UserID != userID).Result.UserID;
                var profile = await _IProfile.GetProfileInfo(Userid);
                return await Task.FromResult(new AllChatsViewModel()
                {
                    Title = profile.Name,
                    ChatID = chatID,
                    Image = profile.ImageName,
                    CountNoSee = countNoSee,
                    Method = "User"
                });
            }
        }

        public async Task<IEnumerable<AllCommentsViewModel>> GetAllComments(string userID, string chatID)
        {
            List<AllCommentsViewModel> List = new List<AllCommentsViewModel>();

            foreach (var sub in db.ChatComments.Include(s => s.ChatUsers).Where(s => s.ChatUsers.ChatID == chatID).OrderBy(s => s.CreateDate))
            {
                var profile = await _IProfile.GetProfileInfo(sub.ChatUsers.UserID);
                List.Add(new AllCommentsViewModel()
                {
                    ChatID = chatID,
                    Message = sub.Message,
                    CreateDate = sub.CreateDate.ToDateTime(),
                    IsSee = sub.IsSee,
                    UserID = sub.ChatUsers.UserID,
                    ImageName = profile.ImageName,
                    Name = profile.Name,
                    CommentID = sub.ChatCommentID
                });
            }

            return await Task.FromResult(List);
        }

        public async Task<ChatComments> AddComment(AddCommentViewModel commentModel, string userId)
        {
            if (await db.ChatUsers.AnyAsync(s => s.UserID == userId && s.ChatID == commentModel.ChatID))
            {
                string chatUserID = db.ChatUsers.FirstOrDefaultAsync(s => s.ChatID == commentModel.ChatID && s.UserID == userId)
                    .Result.ChatUserID;
                ChatComments comment = new ChatComments()
                {
                    ChatUserID = chatUserID,
                    Message = commentModel.Message,
                    CreateDate = DateTime.Now,
                    IsSee = false,
                    ChatCommentID = HashGeneratore.Guid()
                };
                db.Add(comment);
                await db.SaveChangesAsync();
                return await Task.FromResult(comment);
            }
            return null;
        }

        public async Task<bool> DeleteComment(string commentId, string userId)
        {
            var comment = await GetComment(commentId);
            if (comment.ChatUsers.UserID == userId)
            {
                db.Remove(comment);
                await db.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> EditComment(EditCommentViewModel commentModel, string userId)
        {
            var comment = await GetComment(commentModel.CommentID);
            if (comment.ChatUsers.UserID == userId)
            {
                comment.Message = commentModel.Message;
                db.Update(comment);
                await db.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<ChatComments> GetComment(string commentID)
        {
            return await db.ChatComments.Include(s => s.ChatUsers).SingleOrDefaultAsync(s => s.ChatCommentID == commentID);
        }

        public async Task ChangeSeenComment(string commentId)
        {
            var comment = await GetComment(commentId);
            comment.IsSee = true;
            db.Update(comment);
            await db.SaveChangesAsync();
        }

        public async Task ChangeSeenAllComment(string chatID, string userID)
        {
            foreach (var item in db.ChatComments.Where(s => s.ChatUsers.ChatID == chatID && s.ChatUsers.UserID != userID && s.IsSee == false))
            {
                item.IsSee = true;
                db.Update(item);
            }
            await db.SaveChangesAsync();
        }

        public async Task DeleteHistory(string chatId, string userId)
        {
            if (await ExistUserInChat(chatId, userId))
            {
                foreach (var item in db.ChatComments.Where(
                    s => s.ChatUsers.UserID == userId && s.ChatUsers.ChatID == chatId))
                {
                    db.Remove(item);
                }
                await db.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistUserInChat(string chatID, string userId)
        {
            if (await db.ChatUsers.AnyAsync(s => s.UserID == userId && s.ChatID == chatID))
                return true;
            else
                return false;
        }

        public async Task DeleteChat(string chatId, string userId)
        {
            if (await ExistUserInChat(chatId, userId))
            {
                var chat = await db.Chats.FindAsync(chatId);
                foreach (var item in db.ChatComments.Where(s => s.ChatUsers.ChatID == chatId))
                {
                    db.Remove(item);
                }
                foreach (var item in db.ChatUsers.Where(s => s.ChatID == chatId))
                {
                    db.Remove(item);
                }
                db.Remove(chat);
                await db.SaveChangesAsync();
            }
        }

        public async Task<List<ProfileInfoSearchViewModel>> GetResaultSearchAddUser(string chatID, string userID, string mobile)
        {
            List<ProfileInfoSearchViewModel> model = new List<ProfileInfoSearchViewModel>();
            List<string> listNotUser = await GetNotSearchAddUser(chatID);
            foreach (var item in db.Users.Where(s => s.Mobile.Contains(mobile)))
            {
                if (listNotUser.All(s => s != item.UserID))
                {
                    var profile = await _IProfile.GetProfileInfo(item.UserID);
                    model.Add(new ProfileInfoSearchViewModel()
                    {
                        UserID = item.UserID,
                        Name = profile.Name,
                        ImageName = profile.ImageName
                    });
                }
            }
            return await Task.FromResult(model);
        }

        public async Task AddUserToGroup(string chatID, List<string> listUserId)
        {
            foreach (var item in listUserId)
            {
                if (await db.ChatUsers.AnyAsync(s => s.ChatID == chatID && s.UserID == item))
                {
                    var chatUser = await db.ChatUsers.FirstOrDefaultAsync(s => s.ChatID == chatID && s.UserID == item);
                    chatUser.IsExit = false;
                    db.Update(chatUser);
                }
                else
                {
                    db.Add(new ChatUsers()
                    {
                        UserID = item,
                        ChatID = chatID,
                        IsExit = false,
                        ChatUserID = HashGeneratore.Guid()
                    });
                }
            }
            await db.SaveChangesAsync();
        }

        public async Task ExitGroup(string chatID, string userID)
        {
            var chatUser = await db.ChatUsers.FirstOrDefaultAsync(s => s.ChatID == chatID && s.UserID == userID);
            chatUser.IsExit = true;
            db.Update(chatUser);
            await db.SaveChangesAsync();
            if (db.ChatUsers.Count(s => s.IsExit == false && s.ChatID == chatID) == 0)
            {
                foreach (var item in db.ChatComments.Where(s => s.ChatUsers.ChatID == chatID))
                {
                    db.Remove(item);
                }

                foreach (var item in db.ChatUsers.Where(s => s.ChatID == chatID))
                {
                    db.Remove(item);
                }

                var chat = await db.Chats.FindAsync(chatID);
                db.Remove(chat);
                await db.SaveChangesAsync();
            }
        }

        public async Task EditNameGroup(string chatID, string title, string userID)
        {
            if (await ExistUserInChat(chatID, userID))
            {
                var chat = await db.Chats.FindAsync(chatID);
                if (chat.Title != null)
                {
                    chat.Title = title;
                    db.Update(chat);
                    await db.SaveChangesAsync();
                }
            }
        }

        public async Task<ProfileViewModel> GetProfileUser(string ID, string userID)
        {
            var chat = await db.Chats.FindAsync(ID);
            if (chat != null && await ExistUserInChat(chat.ChatID, userID))
            {
                if (chat.Title == null)
                {
                    string UserID = db.ChatUsers
                        .FirstOrDefaultAsync(s => s.ChatID == chat.ChatID && s.UserID != userID)
                        .Result.UserID;
                    return await _IProfile.GetProfileViewModel(UserID);
                }
            }
            else if (await db.Users.AnyAsync(s => s.UserID == ID))
            {
                return await _IProfile.GetProfileViewModel(ID);
            }

            return await Task.FromResult(new ProfileViewModel());
        }

        public async Task<ProfileGroupViewModel> GetProfileGroup(string chatID, string UserId)
        {
            var chat = await db.ChatProfiles.Include(s => s.Chats).SingleOrDefaultAsync(s => s.ChatID == chatID);
            if (chat != null && await ExistUserInChat(chatID, UserId))
            {
                List<ListUserProfileGroup> ListUsers = new List<ListUserProfileGroup>();
                foreach (var item in db.ChatUsers.Where(s => s.ChatID == chatID && s.IsExit == false))
                {
                    string name = _IProfile.GetProfileInfo(item.UserID).Result.Name;
                    ListUsers.Add(new ListUserProfileGroup()
                    {
                        UserID = item.UserID,
                        Name = name
                    });
                }

                return await Task.FromResult(new ProfileGroupViewModel()
                {
                    ImageName = await _IProfile.GetImageNameChatGroup(chatID, false),
                    CreateDate = chat.Chats.CreateDate.ToDateTime(),
                    Bio = chat.Bio,
                    CreateUser = new ListUserProfileGroup()
                    {
                        Name = _IProfile.GetProfileInfo(chat.UserID).Result.Name,
                        UserID = chat.UserID
                    },
                    Name = chat.Chats.Title,
                    ListUsers = ListUsers
                });
            }
            return await Task.FromResult(new ProfileGroupViewModel());
        }

        private async Task<List<string>> GetNotSearchAddUser(string chatID)
        {
            List<string> model = new List<string>();
            foreach (var item in db.ChatUsers.Where(s => s.ChatID == chatID && s.IsExit == false))
            {
                model.Add(item.UserID);
            }
            return await Task.FromResult(model);
        }
    }
}
