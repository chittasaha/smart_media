
namespace SmartMedia.Core.Models
{
    public class Video : MediaBase
    {
        public Video() : base("video"){
    
        }

        public string src { get; set; }
		public string altSrc { get; set; }
        public string skinUrl { get; set; }
		public string  startEffect  { get; set; }
		public TimeSpan startEffectDuration { get; set; }
		public string  endEffect  { get; set; }
		public TimeSpan endEffectDuration { get; set; } 
		public int volume { get; set; }
    }
}
