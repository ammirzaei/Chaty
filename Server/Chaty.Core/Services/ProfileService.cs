using System;
using System.Collections.Generic;
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
    public class ProfileService : IProfile
    {
        private readonly ChatyContext db;
        private readonly IConfiguration _iConfiguration;

        public ProfileService(ChatyContext db, IConfiguration iConfiguration)
        {
            this.db = db;
            _iConfiguration = iConfiguration;
        }

        public async Task<ProfileInfoViewModel> GetProfileInfo(string userID)
        {
            var user = await GetUser(userID);
            bool isProfile = await ExistProfile(userID);
            if (isProfile)
            {
                string imageName = _iConfiguration["MyAddress"] + "/Images/Profiles/Thumb/";
                if (user.Profile.ImageName != null)
                {
                    imageName += user.Profile.ImageName;
                }
                else
                {
                    imageName = null;
                }
                return new ProfileInfoViewModel()
                {
                    Name = user.Profile.Name,
                    ImageName = imageName
                };
            }
            else
            {
                return new ProfileInfoViewModel()
                {
                    Name = user.Mobile,
                    ImageName = null
                };
            }
        }

        public async Task<bool> ExistProfile(string userID)
        {
            return await db.Profiles.AnyAsync(s => s.UserID == userID);
        }

        public async Task<ProfileViewModel> GetProfileViewModel(string userID)
        {
            var user = await GetUser(userID);
            bool isProfile = await ExistProfile(userID);
            if (isProfile)
            {
                string imageName = _iConfiguration["MyAddress"] + "/Images/Profiles/Main/";
                if (user.Profile.ImageName != null)
                {
                    imageName += user.Profile.ImageName;
                }
                else
                {
                    imageName = null;
                }
                return new ProfileViewModel()
                {
                    UserID = user.UserID,
                    Mobile = user.Mobile,
                    CreateDate = user.CreateDate.ToDateTime(),
                    ImageName = imageName,
                    Bio = user.Profile.Bio,
                    Name = user.Profile.Name
                };
            }
            else
            {
                return new ProfileViewModel()
                {
                    UserID = user.UserID,
                    Mobile = user.Mobile,
                    CreateDate = user.CreateDate.ToDateTime(),
                    ImageName = null,
                    Bio = "",
                    Name = user.Mobile
                };
            }
        }

        public async Task AddProfile(string userID)
        {
            Profile profile = new Profile()
            {
                Bio = null,
                ImageName = null,
                Name = null,
                UserID = userID,
                ProfileID = HashGeneratore.Guid()
            };
            db.Add(profile);
            await db.SaveChangesAsync();
        }

        public async Task<Users> GetUser(string userID)
        {
            return await db.Users.Include(s => s.Profile).SingleOrDefaultAsync(s => s.UserID == userID);
        }

        public async Task<Profile> GetProfile(string userID)
        {
            return await db.Profiles.Include(s => s.Users).SingleOrDefaultAsync(s => s.UserID == userID);
        }

        public async Task UpdateProfileName(string userID, string name)
        {
            if (!await ExistProfile(userID))
            {
                await AddProfile(userID);
            }

            var profile = await GetProfile(userID);
            profile.Name = name;
            db.Update(profile);
            await db.SaveChangesAsync();
        }

        public async Task UpdateProfileBio(string userID, string bio)
        {
            if (!await ExistProfile(userID))
            {
                await AddProfile(userID);
            }
            var profile = await GetProfile(userID);
            profile.Bio = bio;
            db.Update(profile);
            await db.SaveChangesAsync();
        }

        public async Task<string> UpdateProfileAvatar(string userID, string imageName)
        {
            if (!await ExistProfile(userID))
            {
                await AddProfile(userID);
            }
            var profile = await GetProfile(userID);
            profile.ImageName = imageName;
            db.Update(profile);
            await db.SaveChangesAsync();
            return _iConfiguration["MyAddress"] + "/Images/Profiles/Main/" + imageName;
        }

        public async Task<string> ExistProfileImageName(string userID)
        {
            var profile = await GetProfile(userID);
            return profile.ImageName;
        }

        public async Task<string> GetImageNameChatGroup(string chatID, bool IsThumb)
        {
            var chat = await db.ChatProfiles.SingleOrDefaultAsync(s => s.ChatID == chatID);
            if (chat != null)
            {
                string path = IsThumb ? "Thumb" : "Main";
                string image = null;
                if (chat.ImageName != null)
                    image = $"{_iConfiguration["MyAddress"]}/Images/Profiles/{path}/{chat.ImageName}";

                return await Task.FromResult(image);
            }
            return await Task.FromResult("");
        }
    }
}
