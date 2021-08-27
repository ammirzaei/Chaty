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
using Microsoft.Extensions.Configuration;

namespace Chaty.Core.Services
{
    public class HomeService : IHome
    {
        private readonly ChatyContext db;
        private readonly IProfile _IProfile;

        public HomeService(ChatyContext db, IProfile iProfile)
        {
            this.db = db;
            _IProfile = iProfile;
        }

        public async Task<IEnumerable<ProfileInfoSearchViewModel>> GetResultSearchNewComment(string mobile, string userID)
        {
            List<ProfileInfoSearchViewModel> model = new List<ProfileInfoSearchViewModel>();
            foreach (var item in db.Users.Where(s => s.Mobile.Contains(mobile) && s.UserID != userID))
            {
                var profile = await _IProfile.GetProfileInfo(item.UserID);
                model.Add(new ProfileInfoSearchViewModel()
                {
                    UserID = item.UserID,
                    ImageName = profile.ImageName,
                    Name = profile.Name
                });
            }

            return await Task.FromResult(model);
        }

        public async Task<AllChatsViewModel> StartContact(List<string> usersIdTarget, string userIdMe)
        {
            string titleChat = usersIdTarget.Count() > 1 ? "گروه جدید" : null;
            Chats chat = new Chats()
            {
                CreateDate = DateTime.Now,
                Title = titleChat,
                ChatID = HashGeneratore.Guid()
            };
            db.Add(chat);
            await db.SaveChangesAsync();
            if (titleChat != null)
            {
                db.Add(new ChatProfiles()
                {
                    ChatID = chat.ChatID,
                    UserID = userIdMe,
                    ImageName = null,
                    Bio = null,
                    ChatProfileID = HashGeneratore.Guid()
                });
            }
            db.Add(new ChatUsers()
            {
                UserID = userIdMe,
                ChatID = chat.ChatID,
                IsExit = false,
                ChatUserID = HashGeneratore.Guid()
            });
            foreach (var item in usersIdTarget)
            {
                db.Add(new ChatUsers()
                {
                    UserID = item,
                    ChatID = chat.ChatID,
                    IsExit = false,
                    ChatUserID = HashGeneratore.Guid()
                });
            }
            await db.SaveChangesAsync();
            string method = chat.Title == null ? "User" : "Group";
            string title = titleChat != null ? titleChat : _IProfile.GetProfileInfo(usersIdTarget[0]).Result.Name;
            return await Task.FromResult(new AllChatsViewModel()
            {
                Title = title,
                Method = method,
                CountNoSee = 0,
                ChatID = chat.ChatID
            });
        }

        public async Task<bool> ExistContact(string UserIdMe, List<string> UserIdTarget)
        {
            if (UserIdTarget.Count() == 1)
            {
                if (await db.ChatUsers.AnyAsync(s => s.UserID == UserIdMe&&s.Chats.Title==null) &&
                    await db.ChatUsers.AnyAsync(s => s.UserID == UserIdTarget[0] && s.Chats.Title == null))
                {
                    return await Task.FromResult(true);
                }
            }
            return await Task.FromResult(false);
        }

    }
}
