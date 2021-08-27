using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Chaty.Data.Entity
{
   public class ChatUsers
    {
        [Key]
        [MaxLength(50)]
        public string ChatUserID { get; set; }

        [MaxLength(50)]
        public string ChatID { get; set; }

        [MaxLength(50)]
        public string UserID { get; set; }

        [Required]
        public bool IsExit { get; set; }

        [ForeignKey("ChatID")]
        public virtual Chats Chats { get; set; }

        [ForeignKey("UserID")]
        public virtual Users Users { get; set; }

        public virtual ICollection<ChatComments> ChatComments { get; set; }
    }
}
