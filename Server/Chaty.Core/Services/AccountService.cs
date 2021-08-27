using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Chaty.Core.Interfaces;
using Chaty.Data.Context;
using Chaty.Data.Entity;
using Microsoft.EntityFrameworkCore;

namespace Chaty.Core.Services
{
    public class AccountService : IAccount
    {
        private readonly ChatyContext db;

        public AccountService(ChatyContext db)
        {
            this.db = db;
        }
        public async Task AddUser(Users user)
        {
            db.Add(user);
            await db.SaveChangesAsync();
        }

        public async Task<bool> ExistMobile(string mobile)
        {
            return await db.Users.AnyAsync(s => s.Mobile == mobile);
        }

        public async Task<bool> ExistUser(string mobile, string password)
        {
            return await db.Users.AnyAsync(s => s.Mobile == mobile && s.Password == password);
        }

        public async Task<Users> GetUser(string mobile, string password)
        {
            return await db.Users.SingleOrDefaultAsync(s => s.Mobile == mobile && s.Password == password);
        }
    }
}
