using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Chaty.Data.Entity
{
    public class Chats
    {
        [Key]
        [MaxLength(50)]
        public string ChatID { get; set; }

        [MaxLength(150)]
        public string Title { get; set; }

        public DateTime CreateDate { get; set; }

        public virtual ICollection<ChatUsers> ChatUsers { get; set; }
        public virtual ChatProfiles ChatProfiles { get; set; }
    }
}
