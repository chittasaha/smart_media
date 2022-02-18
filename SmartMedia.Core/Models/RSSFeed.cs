
namespace SmartMedia.Core.Models
{
    public class RSSFeed : MediaBase
    {
        public RSSFeed() : base("rss") { }
        public string src {get;set;}
		public int slideInterval {get;set;} //seconds
		public int refreshInterval {get;set;} //seconds
		public string bgColor {get;set;}
		public string fontName {get;set;}
		public int fontSize {get;set;}
		public string fontColor {get;set;}
    }
}
