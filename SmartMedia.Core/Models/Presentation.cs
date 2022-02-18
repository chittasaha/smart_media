using SmartMedia.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartMedia.Core.Models
{
    [DataContract]
    public class Presentation : SmartMedia.Core.Models.PresentationBase, IEntity
    {
        public MongoDB.Bson.ObjectId Id { get; set; }
    }
}
