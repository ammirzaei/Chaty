using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Chaty.Core.ViewModels
{
    public class AllChatsViewModel
    {
        public string ChatID { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public int CountNoSee { get; set; }
        public string Method { get; set; }
    }

    public class AllCommentsViewModel
    {
        public string ChatID { get; set; }
        public string CommentID { get; set; }
        public string UserID { get; set; }
        public string Name { get; set; }
        public string ImageName { get; set; }
        public string Message { get; set; }
        public string CreateDate { get; set; }
        public bool IsSee { get; set; }
    }

    public class EditNameGroupViewModel
    {
        public string ChatID { get; set; }
        public string Title { get; set; }
    }

    public class AddCommentViewModel
    {
        public string ChatID { get; set; }

        [DataType(DataType.MultilineText)]
        [MaxLength(500)]
        public string Message { get; set; }
    }
    public class EditCommentViewModel
    {
        public string CommentID { get; set; }

        [DataType(DataType.MultilineText)]
        [MaxLength(500)]
        public string Message { get; set; }
    }
}
