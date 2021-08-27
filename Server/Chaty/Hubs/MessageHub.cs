using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Chaty.Core.Classes;
using Chaty.Core.Interfaces;
using Chaty.Core.ViewModels;
using Microsoft.AspNetCore.SignalR;

namespace Chaty.Hubs
{
    public class MessageHub : Hub
    {
        private readonly IChats _IChats;
        private readonly IProfile _IProfile;

        public MessageHub(IChats iChats, IProfile iProfile)
        {
            _IChats = iChats;
            _IProfile = iProfile;
        }
        public override Task OnConnectedAsync()
        {
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            Groups.AddToGroupAsync(Context.ConnectionId, ChatID);

            return base.OnConnectedAsync();
        }

        public async Task SendMessage(string commentID)
        {
            var comment = await _IChats.GetComment(commentID);
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            var profile = await _IProfile.GetProfileInfo(comment.ChatUsers.UserID);
            AllCommentsViewModel model = new AllCommentsViewModel()
            {
                ChatID = ChatID,
                Message = comment.Message,
                UserID = comment.ChatUsers.UserID,
                CreateDate = comment.CreateDate.ToDateTime(),
                IsSee = comment.IsSee,
                Name = profile.Name,
                ImageName = profile.ImageName,
                CommentID = commentID
            };
            await Clients.Group(ChatID).SendAsync("ReceiveSendMessage", model);
        }

        public async Task DeleteMessage(string commentID)
        {
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            await Clients.Group(ChatID).SendAsync("ReceiveDeleteMessage", commentID);
        }

        public async Task EditMessage(string commentID)
        {
            var comment = await _IChats.GetComment(commentID);
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            await Clients.Group(ChatID).SendAsync("ReceiveEditMessage", commentID, comment.Message);
        }

        public async Task SeenMessage(string commentID)
        {
            await _IChats.ChangeSeenComment(commentID);
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            await Clients.Group(ChatID).SendAsync("ReceiveSeen", commentID);
        }

        public async Task SeenAllMessage(string userId)
        {
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            await _IChats.ChangeSeenAllComment(ChatID, userId);
            await Clients.Group(ChatID).SendAsync("ReceiveAllSeen", userId);
        }

        public async Task DeleteHistory(string userId)
        {
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            await Clients.Group(ChatID).SendAsync("ReceiveDeleteHistory", userId,ChatID);
        }
    }
}
