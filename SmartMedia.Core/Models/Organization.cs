using MongoDB.Bson;
using SmartMedia.Core.Interfaces;

namespace SmartMedia.Core.Models
{
    public class Organization : IEntity, IOrganization
    {
        public Organization() { }
        public Organization(IOrganization org)
        {
            this.Name = org.Name;
            this.Phone = org.Phone;
            this.Remark = org.Remark;
            this.TotalInstanceOfDesigner = org.TotalInstanceOfDesigner;
            this.TotalPlayerInstance = org.TotalPlayerInstance;
            this.Address = org.Address;
        }

        public ObjectId Id
        {
            get;
            set;
        }
        public string Name { get; set; }
        public string Address { get; set; }
        public int TotalInstanceOfDesigner { get; set; }
        public int TotalPlayerInstance { get; set; }
        public string Phone { get; set; }
        public string Remark { get; set; }
    }
}
