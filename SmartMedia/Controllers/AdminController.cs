using Microsoft.AspNet.Identity;
using MongoDB.Bson;
using MongoDB.Driver.Builders;
using SmartMedia.DAL;
using SmartMedia.Models;
using SmartMedia.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using SmartMedia.Core.Models;
using SmartMedia.Core.Interfaces;

namespace SmartMedia.Controllers
{
    [Authorize(Roles="Admin, SuperAdmin")]
    public class AdminController : ControllerBase
    {
        //
        // GET: /Admin/
        [HttpGet]
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated && HttpContext.Cache.Get("Organization") == null) {
                var org = this.GetLoggedInUserOrganization();
                if(org != null){
                    HttpContext.Cache.Insert("Organization", org);
                }                
            }
                  
            return View();
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin")]
        public ActionResult GetOrganizations() {
            DataContext dbContext = new DataContext();
            var orgList = dbContext.GetDataCollection<Organization>("Organization").FindAllAs<Organization>()
                .Select(
                org => new OrganizationViewModel(org)).ToArray();

            var result = new JsonResult() { 
                Data = orgList,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet                
            };

            return result;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin, Admin")]
        public ActionResult GetRoles()
        {
            DataContext dbContext = new DataContext();
            var roleList = dbContext.GetDataCollection<Role>("Role").FindAllAs<Role>().Select(
                role => role.Name).ToArray();

            if (roleList.Count() == 0) {
                var roleListTemp = new List<Role>();
                roleListTemp.Add(new Role() { Name = "Admin" });
                roleListTemp.Add(new Role() { Name = "Manager" });
                roleListTemp.Add(new Role() { Name = "Designer" });

                roleList = roleListTemp.Select(r => r.Name).ToArray();
            }

            var result = new JsonResult()
            {
                Data = roleList,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

            return result;
        }

        [HttpGet]
        public ActionResult CreateOrganization()
        {
            return View();    
        }

        [HttpPost]
        public ActionResult SaveOrganization(OrganizationViewModel org)
        {
            IOrganization orgModel = org as IOrganization;
            
            DataContext dbContext = new DataContext();
            if (!string.IsNullOrEmpty(org.Id))
            {
                var dbOrg = dbContext.GetDataCollection<Organization>("Organization").FindOne(Query.EQ("_id", ObjectId.Parse(org.Id)));
                
                dbOrg.Address = org.Address;
                dbOrg.Name = org.Name;
                dbOrg.Phone = org.Phone;
                dbOrg.Remark = org.Remark;
                dbOrg.TotalInstanceOfDesigner = org.TotalInstanceOfDesigner;
                dbOrg.TotalPlayerInstance = org.TotalPlayerInstance;
                dbContext.UpdateOrganization(dbOrg);

            }
            else {
                Organization orgNew = new Organization(orgModel);
                dbContext.CreateOrganization(orgNew);
            }
            //dbContext.CreateOrganization(org);

            return RedirectToAction("GetOrganizations");  

        }


        [HttpPost]
        public ActionResult DeleteOrganization(OrganizationViewModel org)
        {
            bool result = false;
            string msg = string.Empty;
            try
            {
                DataContext dbContext = new DataContext();

                dbContext.DeleteOrganization(org.Id);
                result = true;
            }
            catch (Exception exp){
                msg = exp.Message;
            }

            return new JsonResult { 
                Data = new {IsSucess = result, Message = msg},
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }
        [HttpPost]
        [Authorize(Roles="SuperAdmin, Admin")]
        public ActionResult SaveUser(MediaUser user) {

            var appUser = new ApplicationUser() { 
                FullName = user.Name,
                UserName = user.UserId,
                OrganizationId = user.OrganizationId,
                ResetPasswordNeeded = true
            };

            appUser.Roles.Add(user.Role);
            var result = this.UserManager.Create(appUser, user.Password);
            return new JsonResult()
            {
                Data = result.Succeeded,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };     
        }
        [HttpGet]
        [Authorize(Roles = "SuperAdmin, Admin")]
        public ActionResult GetUsers(string orgId) { 
            DataContext dbContext = new DataContext();
            var result = dbContext.GetDataCollection<ApplicationUser>("AspNetUsers").Find(Query.EQ("OrganizationId", orgId)).Select(
                aUser => new {
                    UserName = aUser.FullName,
                    UserId = aUser.UserName,
                    Role = aUser.Roles[0]});

            return new JsonResult()
            {
                Data = result,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        private Organization GetLoggedInUserOrganization() {
            string loggedInUserId = User.Identity.GetUserName();

            
            DataContext dbContext = new DataContext();
            var appUser = dbContext.GetDataCollection<ApplicationUser>("AspNetUsers").FindOne(Query.EQ("UserName", loggedInUserId));
            if (string.IsNullOrEmpty(appUser.OrganizationId))
            {
                return null;
            }

            var org = dbContext.GetDataCollection<Organization>("Organization").Find(Query.EQ("_id", ObjectId.Parse(appUser.OrganizationId))).SingleOrDefault();

            return org;
        }
	}

  
}