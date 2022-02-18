using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SmartMedia.Core.Interfaces;
using System;

namespace SmartMedia.Core.Models
{
    public class PlayList : IEntity
    {
        [BsonId]
        public ObjectId DefaultPresentationId { get; set; }
        public DateTime LastUpdated { get; set; }
        public Schedule[] Schedules { get; set; }

        public MongoDB.Bson.ObjectId Id { get; set; }
    }
}
