using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Chaty.Core.Classes;
using Chaty.Core.Interfaces;
using Chaty.Data.Context;
using Chaty.Data.Entity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Chaty.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccount _IAccount;
        private readonly IConfiguration _IConfiguration;

        public AccountController(IAccount iAccount, IConfiguration iConfiguration)
        {
            _IAccount = iAccount;
            _IConfiguration = iConfiguration;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> PostRegister([FromBody] Users User)
        {
            if (ModelState.IsValid)
            {
                if (!await _IAccount.ExistMobile(User.Mobile))
                {
                    Users user = new Users()
                    {
                        Mobile = User.Mobile,
                        Password = HashGeneratore.MD5(User.Password),
                        CreateDate = DateTime.Now,
                        UserID = HashGeneratore.Guid()
                    };

                    await _IAccount.AddUser(user);
                    return Ok(200);
                }
                return Ok(400);
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> PostLogin([FromBody] Users User)
        {
            if (ModelState.IsValid)
            {
                string hashPassword = HashGeneratore.MD5(User.Password);
                if (await _IAccount.ExistUser(User.Mobile, hashPassword))
                {
                    var user = await _IAccount.GetUser(User.Mobile, hashPassword);

                    var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_IConfiguration["SymmetricSecurityKey"]));
                    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                    var tokenOption = new JwtSecurityToken(
                        issuer: _IConfiguration["MyAddress"],
                        claims: new List<Claim>()
                        {
                            new Claim(ClaimTypes.NameIdentifier,user.UserID.ToString()),
                            new Claim(ClaimTypes.Name,user.Mobile)
                        },
                        expires: DateTime.Now.AddDays(5),
                        signingCredentials: signinCredentials
                        );
                    var Token = new JwtSecurityTokenHandler().WriteToken(tokenOption);

                    return Ok(new { token = Token, UserID = user.UserID });
                }
                return Ok(400);
            }
            return BadRequest();
        }
    }
}
