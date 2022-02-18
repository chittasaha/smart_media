using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace SmartMedia.Core.Models
{
    [DataContract]
    [KnownType(typeof(Image))]
    public class Page
    {
        [DataMember]
        public string startEffect { get; set; }
        [DataMember]
        public string endEffect { get; set; }
        [DataMember]
        public int startEffectDuration { get; set; }
        [DataMember]
        public int endEffectDuration { get; set; }
        [DataMember]
        public TimeSpan duration { get; set; }
        [DataMember]
        public string bgColor { get; set; }
        [DataMember]
        public string bgImageSrc { get; set; }
        [DataMember]
        public string bgType { get; set; }
        [DataMember]
        public string audioSrc { get; set; }
        [DataMember]
        public ICollection<Image> images {get;set;}
        [DataMember]
        public ICollection<Video> videos { get; set; }
        [DataMember]
        public ICollection<Text> texts { get; set; }
        [DataMember]
        public ICollection<RSSFeed> feeds { get; set; }


    }
}
