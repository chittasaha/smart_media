using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SmartMedia.Core.Interfaces;

namespace SmartMedia.Core.Models
{
    public class Schedule : IEntity
    {
        [BsonId]
        public ObjectId PresentationId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool RepeatAllDay { get; set; }
        public bool RepeatAllMonday { get; set; }
        public bool RepeatAllTuesday { get; set; }
        public bool RepeatAllWednesDay { get; set; }
        public bool RepeatAllThursday { get; set; }
        public bool RepeatAllFriday { get; set; }
        public bool RepeatAllSaturday { get; set; }
        public bool RepeatAllSunday { get; set; }

        public MongoDB.Bson.ObjectId Id { get; set; }
    }
}
