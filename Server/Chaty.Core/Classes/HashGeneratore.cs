using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Chaty.Core.Classes
{
    public static class HashGeneratore
    {
        public static string MD5(string Password)
        {
            Byte[] Mainbyte;
            Byte[] Encodebyte;
            MD5 MD5 = new MD5CryptoServiceProvider();

            Mainbyte = ASCIIEncoding.Default.GetBytes(Password.ToLower());
            Encodebyte = MD5.ComputeHash(Mainbyte);

            return BitConverter.ToString(Encodebyte);
        }

        public static string Guid()
        {
            return System.Guid.NewGuid().ToString();
        }
    }
}
