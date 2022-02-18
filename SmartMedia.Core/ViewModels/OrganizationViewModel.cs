using SmartMedia.Core.Interfaces;
using SmartMedia.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmartMedia.Core.ViewModels
{
    public class OrganizationViewModel : ViewModelBase, IOrganization
    {
        public OrganizationViewModel() { }
        public OrganizationViewModel(Organization org){
            this.Id = org.Id.ToString();
            this.Address = org.Address;
            this.Name = org.Name;
            this.Phone = org.Phone;
            this.Remark = org.Remark;
            this.TotalInstanceOfDesigner = org.TotalInstanceOfDesigner;
            this.TotalPlayerInstance = org.TotalPlayerInstance;
        }

        public string Name { get; set; }
        public string Address { get; set; }
        public int TotalInstanceOfDesigner { get; set; }
        public int TotalPlayerInstance { get; set; }
        public string Phone { get; set; }
        public string Remark { get; set; }
    }
}