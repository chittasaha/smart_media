using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartMedia.Core.Models
{
    public class MediaUser
    {
        public string Name { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string OrganizationId { get; set; }
    }
}
