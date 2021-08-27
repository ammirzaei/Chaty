using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Chaty.Data.Entity
{
    public class ChatProfiles
    {
        [Key]
        [MaxLength(50)]
        public string ChatProfileID { get; set; }
        public string ChatID { get; set; }
        public string UserID { get; set; }

        [MaxLength(50)]
        public string ImageName { get; set; }

        [MaxLength(200)]
        [DataType(DataType.MultilineText)]
        public string Bio { get; set; }

        [ForeignKey("ChatID")]
        public virtual Chats Chats { get; set; }

        [ForeignKey("UserID")]
        public virtual Users Users { get; set; }
    }
}
