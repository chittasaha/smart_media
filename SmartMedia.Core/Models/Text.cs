
namespace SmartMedia.Core.Models
{
    public class Text : MediaBase
    {
        public Text() : base("text") { }
        public string bgColor { get; set; }
        public string text { get; set; } 

    }
}
