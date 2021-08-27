using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Chaty.Core.Classes;
using Chaty.Core.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;

namespace Chaty.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfile _IProfile;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProfileController(IProfile iProfile, IWebHostEnvironment webHostEnvironment)
        {
            _IProfile = iProfile;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        [Route("Info")]
        public async Task<IActionResult> GetProfileInfo()
        {
            string UserID = HttpContext.User.Claims.SingleOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
            return Ok(await _IProfile.GetProfileInfo(UserID));
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
            return Ok(await _IProfile.GetProfileViewModel(UserID));
        }

        [HttpPost]
        [Route("EditName/{name}")]
        public async Task<IActionResult> PostEditName([FromRoute] string name)
        {
            string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
            await _IProfile.UpdateProfileName(UserID, name);
            return Ok(200);
        }

        [HttpPost]
        [Route("EditBio/{bio}")]
        public async Task<IActionResult> PostEditBio([FromRoute] string bio)
        {
            string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
            await _IProfile.UpdateProfileBio(UserID, bio);
            return Ok(200);
        }

        [HttpPost]
        [Route("EditImage")]
        public async Task<IActionResult> PostEditImage()
        {
            try
            {
                var file = Request.Form.Files[0];
                if (file != null)
                {
                    if (CheckContentImage.IsImage(file))
                    {
                        string UserID = User.Claims.FirstOrDefault(s => s.Type == ClaimTypes.NameIdentifier).Value.ToString();
                        string ProfileImageName = await _IProfile.ExistProfileImageName(UserID);
                        if (ProfileImageName != null)
                        {
                            FileGeneratore.DeleteFile("Images/Profiles/Main", ProfileImageName, _webHostEnvironment.WebRootPath);
                            FileGeneratore.DeleteFile("Images/Profiles/Thumb", ProfileImageName, _webHostEnvironment.WebRootPath);
                        }
                        string FileName = FileGeneratore.NameFile(file.FileName);
                        await FileGeneratore.SaveFileResizer("Images/Profiles/Main", "Images/Profiles/Thumb", FileName, file, 100, _webHostEnvironment.WebRootPath);
                        return Ok(new { imageName = await _IProfile.UpdateProfileAvatar(UserID, FileName) });
                    }
                    return NoContent();
                }
                return BadRequest();
            }
            catch
            {
                return NoContent();
            }
        }
    }
}
