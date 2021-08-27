using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Chaty.Core.ViewModels;
using Chaty.Data.Entity;

namespace Chaty.Core.Interfaces
{
    public interface IProfile
    {
        Task<ProfileInfoViewModel> GetProfileInfo(string userID);
        Task<bool> ExistProfile(string userID);
        Task<ProfileViewModel> GetProfileViewModel(string userID);
        Task AddProfile(string userID);
        Task<Users> GetUser(string userID);
        Task<Profile> GetProfile(string userID);
        Task UpdateProfileName(string userID, string name);
        Task UpdateProfileBio(string userID, string bio);
        Task<string> UpdateProfileAvatar(string userID, string imageName);
        Task<string> ExistProfileImageName(string userID);
        Task<string> GetImageNameChatGroup(string chatID,bool IsThumb);
    }
}
