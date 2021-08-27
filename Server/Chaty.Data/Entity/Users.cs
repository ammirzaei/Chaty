using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Chaty.Data.Entity
{
    public class Users
    {
        [Key]
        [MaxLength(50)]
        public string UserID { get; set; }

        [MaxLength(11)]
        [Required]
        public string Mobile { get; set; }

        [Required]
        [MaxLength(150)]
        public string Password { get; set; }
        public DateTime CreateDate { get; set; }

        public virtual Profile Profile { get; set; }
        public virtual ICollection<ChatUsers> ChatUsers { get; set; }
        public virtual ICollection<ChatProfiles> ChatProfiles { get; set; }
    }
}
