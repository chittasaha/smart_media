using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartMedia.Core.Interfaces
{
    public interface IOrganization
    {
        string Name { get; set; }
        string Address { get; set; }
        int TotalInstanceOfDesigner { get; set; }
        int TotalPlayerInstance { get; set; }
        string Phone { get; set; }
        string Remark { get; set; }
    }
}
