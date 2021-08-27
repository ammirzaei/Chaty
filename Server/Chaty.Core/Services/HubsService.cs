using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Chaty.Core.Interfaces;
using Chaty.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Chaty.Core.Services
{
    public class HubsService : IHubs
    {
        private readonly ChatyContext db;

        public HubsService(ChatyContext db)
        {
            this.db = db;
        }

        public async Task<List<string>> GetAllChatID(string userId)
        {
            List<string> model = new List<string>();
            model.Add(userId.ToString());
            model.AddRange(await db.ChatUsers.Where(s => s.UserID == userId).Select(s => s.ChatID.ToString()).ToListAsync());
            return await Task.FromResult(model);
        }

        public async Task<List<string>> GetAllUserIDforChat(string chatId)
        {
            return await db.ChatUsers.Where(s => s.ChatID == chatId).Select(s => s.UserID.ToString()).ToListAsync();
        }
    }
}
