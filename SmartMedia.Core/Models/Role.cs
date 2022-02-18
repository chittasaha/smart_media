using MongoDB.Bson;
using SmartMedia.Core.Interfaces;

namespace SmartMedia.Core.Models
{
    public class Role : IEntity
    {
        public ObjectId Id { get; set; }
        public string Name { get; set; }        
    }
}
