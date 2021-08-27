using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Chaty.Core.Interfaces;
using Chaty.Core.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace Chaty.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatsController : ControllerBase
    {
        private readonly IChats _IChats;

        public ChatsController(IChats iChats)
        {
            _IChats = iChats;
        }

        [HttpGet]
        [Route("GetAllChats")]
        public async Task<IActionResult> GetAllChats()
        {
            string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();

            return Ok(await _IChats.GetAllChats(UserID));
        }

        [HttpGet]
        [Route("GetAllComments/{chatID}")]
        public async Task<IActionResult> GetAllComments([FromRoute] string chatID)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();

                return Ok(await _IChats.GetAllComments(UserID, chatID));
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("AddComment")]
        public async Task<IActionResult> PostAddComment([FromBody] AddCommentViewModel commentModel)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                var comment = await _IChats.AddComment(commentModel, UserID);
                if (comment != null)
                {
                    return Ok(new { CommentID = comment.ChatCommentID });
                }
                return NoContent();
            }
            return BadRequest();
        }

        [HttpDelete]
        [Route("DeleteComment/{commentId}")]
        public async Task<IActionResult> DeleteComment([FromRoute] string commentId)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                if (await _IChats.DeleteComment(commentId, UserID))
                {
                    return Ok();
                }
                return NoContent();
            }
            return BadRequest();
        }

        [HttpPut]
        [Route("EditComment")]
        public async Task<IActionResult> PutEditComment([FromBody] EditCommentViewModel commentModel)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                if (await _IChats.EditComment(commentModel, UserID))
                {
                    return Ok();
                }

                return NoContent();
            }

            return BadRequest();
        }

        [HttpDelete]
        [Route("DeleteHistory/{chatId}")]
        public async Task<IActionResult> DeleteHistory([FromRoute] string chatId)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                await _IChats.DeleteHistory(chatId, UserID);
                return Ok(new { UserId = UserID });
            }
            return BadRequest();
        }

        [HttpDelete]
        [Route("DeleteChat/{chatID}")]
        public async Task<IActionResult> DeleteChat([FromRoute] string chatID)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                await _IChats.DeleteChat(chatID, UserID);
                return Ok();
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("GetResultAddUser/{chatID}/{mobile}")]
        public async Task<IActionResult> GetResultAddUser([FromRoute] string chatID, [FromRoute] string mobile)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                return Ok(await _IChats.GetResaultSearchAddUser(chatID, UserID, mobile));
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("AddUserToGroup/{chatID}")]
        public async Task<IActionResult> PostAddUserToGroup([FromRoute] string chatID, [FromBody] List<string> listUser)
        {
            if (ModelState.IsValid)
            {
                await _IChats.AddUserToGroup(chatID, listUser);
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete]
        [Route("ExitGroup/{chatID}")]
        public async Task<IActionResult> ExitGroup([FromRoute] string chatID)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                await _IChats.ExitGroup(chatID, UserID);
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut]
        [Route("EditNameGroup")]
        public async Task<IActionResult> PutEditNameGroup([FromBody] EditNameGroupViewModel model)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                await _IChats.EditNameGroup(model.ChatID, model.Title, UserID);
                return Ok();
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("GetProfileUser/{ID}")]
        public async Task<IActionResult> GetProfileUser([FromRoute] string ID)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                var profile = await _IChats.GetProfileUser(ID, UserID);
                if (profile != null)
                    return Ok(profile);
                else
                    return NotFound();
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("GetProfileGroup/{chatID}")]
        public async Task<IActionResult> GetProfileGroup([FromRoute] string chatID)
        {
            if (ModelState.IsValid)
            {
                string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                var profile = await _IChats.GetProfileGroup(chatID, UserID);
                if (profile != null)
                    return Ok(profile);
                else
                    return NotFound();
            }
            return BadRequest();
        }
    }
}
