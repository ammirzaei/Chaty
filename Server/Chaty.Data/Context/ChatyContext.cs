using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Chaty.Data.Entity;

namespace Chaty.Data.Context
{
    public class ChatyContext : DbContext
    {
        public ChatyContext(DbContextOptions<ChatyContext> options) : base(options)
        {
            ChangeTracker.QueryTrackingBehavior =
                QueryTrackingBehavior.NoTracking;
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Chats> Chats { get; set; }
        public DbSet<ChatUsers> ChatUsers { get; set; }
        public DbSet<ChatComments> ChatComments { get; set; }

        public DbSet<ChatProfiles> ChatProfiles { get; set; }
    }
}
