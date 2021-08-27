using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Chaty.Data.Entity
{
   public class Profile
    {
        [Key]
        [MaxLength(50)]
        public string ProfileID { get; set; }

        [MaxLength(50)]
        public string UserID { get; set; }

        [MaxLength(150)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string ImageName { get; set; }

        [MaxLength(200)]
        public string Bio { get; set; }

        [ForeignKey("UserID")]
        public virtual Users Users { get; set; }
    }
}
