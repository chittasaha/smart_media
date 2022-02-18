using MongoDB.Bson;
using SmartMedia.Core.Interfaces;

namespace SmartMedia.Core.Models
{
    public class PlayerCluster : IEntity
    {
        public string Name { get; set; }
        public ObjectId[] PlayerIds { get; set; }

        public ObjectId Id { get; set; }
    }
}
