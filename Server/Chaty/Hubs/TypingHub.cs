   using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Chaty.Core.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Chaty.Hubs
{
    public class TypingHub : Hub
    {
        private readonly IProfile _IProfiles;

        public TypingHub(IProfile iProfiles)
        {
            _IProfiles = iProfiles;
        }

        public override Task OnConnectedAsync()
        {
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            Groups.AddToGroupAsync(Context.ConnectionId, ChatID);

            return base.OnConnectedAsync();
        }

        public async Task AddTyping(string userId)
        {
            var profile = await _IProfiles.GetProfileInfo(userId);
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            await Clients.Group(ChatID).SendAsync("ReceiveAddTyping", userId, profile.Name, profile.ImageName, ChatID);
        }

        public async Task DeleteTyping(string userId)
        {
            var ChatID = Context.GetHttpContext().Request.Query["ChatID"].ToString();
            await Clients.Group(ChatID).SendAsync("ReceiveDeleteTyping", userId, ChatID);
        }
    }
}
