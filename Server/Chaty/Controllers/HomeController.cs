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
    public class HomeController : ControllerBase
    {
        private readonly IHome _IHome;
        public HomeController(IHome iHome)
        {
            _IHome = iHome;
        }

        [HttpGet]
        [Route("SearchMobile/{mobile}")]
        public async Task<IActionResult> GetSearchMobile([FromRoute] string mobile)
        {
            if (ModelState.IsValid)
            {
                string UserID = HttpContext.User.Claims.SingleOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                return Ok(await _IHome.GetResultSearchNewComment(mobile, UserID));
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("StartContact")]
        public async Task<IActionResult> PostStartContact([FromBody] List<string> listUserID)
        {
            if (ModelState.IsValid)
            {
                string UserID = HttpContext.User.Claims.SingleOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                if (await _IHome.ExistContact(UserID, listUserID))
                {
                    return Ok(true);
                }
                return Ok(await _IHome.StartContact(listUserID, UserID));
            }
            return BadRequest();
        }
    }
}
