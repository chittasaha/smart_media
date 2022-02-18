using SmartMedia.Core.Interfaces;

namespace SmartMedia.Core.Models
{
    public class Player : IEntity
    {
        public string Name { get; set; }
        public string SecreteCode { get; set; }
        public string OrganizationId { get; set; }

        public MongoDB.Bson.ObjectId Id { get; set; }
    }
}
