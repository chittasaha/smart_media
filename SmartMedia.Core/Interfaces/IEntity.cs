﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartMedia.Core.Interfaces
{
    interface IEntity
    {
        [BsonId]
        ObjectId Id { get; set; }
    }
}
