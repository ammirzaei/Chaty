using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace Chaty.Core.Classes
{
    public static class TimeConvertore
    {
        public static string ToDateTime(this DateTime date)
        {
            PersianCalendar Pc = new PersianCalendar();
            return Pc.GetHour(date).ToString("00") + ":" + Pc.GetMinute(date).ToString("00") + ":" +
                   Pc.GetSecond(date).ToString("00") + " " + Pc.GetYear(date) + "/" + Pc.GetMonth(date).ToString("00") + "/" +
                   Pc.GetDayOfMonth(date).ToString("00");
        }
    }
}
