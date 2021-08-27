using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Chaty.Data.Entity;

namespace Chaty.Core.Interfaces
{
   public interface IAccount
   {
       Task AddUser(Users user);
       Task<bool> ExistMobile(string mobile);
       Task<bool> ExistUser(string mobile, string password);
       Task<Users> GetUser(string mobile, string password);
   }
}
