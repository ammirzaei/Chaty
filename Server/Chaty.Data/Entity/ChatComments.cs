using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Chaty.Data.Entity
{
    public class ChatComments
    {
        [Key]
        [MaxLength(50)]
        public string ChatCommentID { get; set; }

        [MaxLength(50)]
        public string ChatUserID { get; set; }

        [Required]
        [MaxLength(500)]
        [DataType(DataType.MultilineText)]
        public string Message { get; set; }

        [Required]
        public bool IsSee { get; set; }
        public DateTime CreateDate { get; set; }

        [ForeignKey("ChatUserID")]
        public virtual ChatUsers ChatUsers { get; set; }
    }
}
