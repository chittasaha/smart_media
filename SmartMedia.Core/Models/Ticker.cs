
namespace SmartMedia.Core.Models
{
    public class Ticker : MediaBase
    {
        public Ticker() : base("ticker") { }

        public string text { get; set; }
		public string rssUrl  { get; set; }
		public string sourceType { get; set; }
		public string fontName  { get; set; }
		public int fontSize { get; set; }
		public string fontColor  { get; set; }
		public string bgColor { get; set; }
        public int slideTime { get; set; }
    }
}
