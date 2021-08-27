using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Chaty.Core.ViewModels
{
    public class ProfileInfoViewModel
    {
        public string Name { get; set; }
        public string ImageName { get; set; }
    }
    public class ProfileInfoSearchViewModel
    {
        public string UserID { get; set; }
        public string Name { get; set; }
        public string ImageName { get; set; }
    }

    public class ProfileViewModel
    {
        public string UserID { get; set; }
        public string Name { get; set; }
        public string ImageName { get; set; }
        public string Bio { get; set; }
        public string Mobile { get; set; }
        public string CreateDate { get; set; }
    }

    public class ProfileGroupViewModel
    {
        public string Name { get; set; }
        public string ImageName { get; set; }
        public string Bio { get; set; }
        public string CreateDate { get; set; }
        public List<ListUserProfileGroup> ListUsers { get; set; }
        public ListUserProfileGroup CreateUser { get; set; }
    }

    public class ListUserProfileGroup
    {
        public string Name { get; set; }
        public string UserID { get; set; }
    }
}
