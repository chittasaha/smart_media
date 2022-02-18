using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartMedia.Core.Models
{
    public abstract class PresentationBase
    {
        public string name { get; set; }
        public ICollection<Page> pages { get; set; }
        public int currentPageIndex { get; set; }
        public ICollection<Ticker> tickers { get; set; }
        public TimeSpan pageDuration { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public string userId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime ModifiedDateTime { get; set; }
    }
}
