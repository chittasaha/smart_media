
namespace SmartMedia.Core.Models
{
    public class Image : MediaBase
    {
        public Image() : base("image") { 
        
        }
        
        public string src { get; set; }
		public string startEffect { get; set; }
		public TimeSpan startEffectDuration {get;set;}
        public string endEffect { get; set; }
        public TimeSpan endEffectDuration { get; set; }
    }
}
