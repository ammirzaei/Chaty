using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Chaty.Core.Classes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;

namespace Chaty.Core.Classes
{
    public static class FileGeneratore
    {
        public static async Task SaveFile(string FilePath, string FileName, IFormFile File, string environment)
        {
            string path = Path.Combine(environment, FilePath, FileName);
            if (!Directory.Exists(path))
            {

            }
            using (var stream = new FileStream(path, FileMode.CreateNew))
            {
                await File.CopyToAsync(stream);
            }
        }
        public static void DeleteFile(string FilePath, string FileName, string environment)
        {
            string path = Path.Combine(environment, FilePath, FileName);
            System.IO.File.Delete(path);
        }

        public static string NameFile(string FileName)
        {
            return Guid.NewGuid() + Path.GetExtension(FileName);
        }

        public static async Task SaveFileResizer(string FilePath1, string FilePath2, string FileName, IFormFile File, int Size, string environment)
        {
            await SaveFile(FilePath1, FileName, File, environment);
            string path1 = Path.Combine(environment, FilePath1, FileName);
            string path2 = Path.Combine(environment, FilePath2, FileName);
            ImageResizer img = new ImageResizer(Size);
            img.Resize(path1, path2);
            //DeleteFile(FilePath1, FileName, environment);
        }
    }
}