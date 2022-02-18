using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SmartMedia.Models
{
    public class DepartmentViewModel
    {
        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Department Name")]
        public string Name { get; set; }
        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Department Address")]
        public string Address { get; set; }
        
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "Department Phone")]
        public string Phone { get; set; }
    }
}