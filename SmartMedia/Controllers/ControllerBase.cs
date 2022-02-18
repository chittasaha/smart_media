using Microsoft.AspNet.Identity;
using MongoDB.AspNet.Identity;
using SmartMedia.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace SmartMedia.Controllers
{
    public class ControllerBase : System.Web.Mvc.Controller
    {
        protected UserManager<ApplicationUser> UserManager = null;
        public  ControllerBase() {
            this.UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>("Mongo"));            
        }

        public string GetCuurentUserId() {

            return this.HttpContext.GetOwinContext().Authentication.User.Identity.GetUserId();
        }


    }
}