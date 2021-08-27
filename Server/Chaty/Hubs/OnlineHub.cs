using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Chaty.Core.Interfaces;
using Chaty.Core.ViewModels;
using Microsoft.AspNetCore.SignalR;

namespace Chaty.Hubs
{
    public class OnlineHub : Hub
    {
        private readonly IHubs _IHubs;
        private readonly IChats _IChats;

        public OnlineHub(IHubs iHubs, IChats iChats)
        {
            _IHubs = iHubs;
            _IChats = iChats;
        }

        public override Task OnConnectedAsync()
        {
            var UserID = Context.GetHttpContext().Request.Query["UserID"].ToString();
            List<string> ListChatID = _IHubs.GetAllChatID(UserID).Result;
            AddToGroups(UserID);

            return base.OnConnectedAsync();
        }

        public void AddToGroups(string userID)
        {
            List<string> ListChatID = _IHubs.GetAllChatID(userID).Result;
            foreach (var item in ListChatID)
            {
                Groups.AddToGroupAsync(Context.ConnectionId, item);
            }
            Clients.Groups(ListChatID).SendAsync("ReceiveOnlineConnect", userID);
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var UserID = Context.GetHttpContext().Request.Query["UserID"].ToString();
            List<string> ListChatID = _IHubs.GetAllChatID(UserID).Result;

            Clients.Groups(ListChatID).SendAsync("ReceiveOnlineDisconnect", UserID);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task ReConnectUser(string userID)
        {
            List<string> ListChatID = await _IHubs.GetAllChatID(userID);
            await Clients.Groups(ListChatID).SendAsync("ReceiveAddOnline", userID);
        }

        public async Task AddNotSeen(string commentID)
        {
            var comment = await _IChats.GetComment(commentID);
            await Clients.Group(comment.ChatUsers.ChatID.ToString()).SendAsync("ReceiveAddNotSeen", comment.ChatUsers.ChatID, comment.ChatUsers.UserID);
        }

        public async Task DeleteNotSeen(string chatID)
        {
            await Clients.Group(chatID.ToString()).SendAsync("ReceiveDeleteNotSeen", chatID);
        }

        public async Task AddChat(string chatID)
        {
            List<string> ListUser = await _IHubs.GetAllUserIDforChat(chatID);
            foreach (var item in ListUser)
            {
                var chat = await _IChats.GetChats(chatID, item);
                await Clients.Group(item).SendAsync("ReceiveAddChat", chat);
            }
        }

        public async Task DeleteChat(string chatID)
        {
            await Clients.Group(chatID.ToString()).SendAsync("ReceiveDeleteChat", chatID);
        }

        public async Task AddUserToGroup(List<string> listUserId)
        {
            int index = listUserId.Count() - 1;
            string chatID = listUserId[index];
            listUserId.RemoveAt(index);
            var chat = await _IChats.GetChats(chatID, null);
            await Clients.Groups(listUserId).SendAsync("ReceiveAddUserToGroup", chat);
        }

        public async Task EditNameGroup(EditNameGroupViewModel model)
        {
            await Clients.Group(model.ChatID.ToString()).SendAsync("ReceiveEditNameGroup", model);
        }
    }
}
