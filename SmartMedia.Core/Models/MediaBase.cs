
namespace SmartMedia.Core.Models
{
    public abstract class MediaBase
    {
        protected MediaBase(string type) {
            this.type = type;
        }
        
        public string type { get; private set; }
        public bool isDesignTime { get; set; }
        public int top { get; set; }
		public int left { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public int startTime { get; set; } //in seconds
        public string provider { get; set; }
		public string uid { get; set; }
    }
}
