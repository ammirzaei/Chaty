using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Chaty.Core.Interfaces
{
    public interface IHubs
    {
        Task<List<string>> GetAllChatID(string userId);
        Task<List<string>> GetAllUserIDforChat(string chatId);
    }
}
