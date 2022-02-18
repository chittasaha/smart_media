using SmartMedia.Core.Models;
using SmartMedia.DAL;
using SmartMedia.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmartMedia.Controllers
{
    [Authorize(Roles = "Designer")]
    public class DesignerController : ControllerBase
    {
        
        // GET: Designer
        public ActionResult Index()
        {
            return View();
        }
        //[HttpPost]
        //public ActionResult SavePresentation(Presentation prs) {
        //    return null;
        //}

        [HttpPost]
        public ActionResult SavePresentation(PresentationViewModel presentation)
        {
            presentation.userId = base.GetCuurentUserId();
            DataContext dbContext = new DataContext();

            string id = dbContext.SavePresentation(presentation.Convert());

            return new JsonResult
            {
                Data = new {Id = id },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                ContentType = "application/json"
            };
        }

        [ActionName("GetExistingPresentations")]
        public ActionResult GetPresentations()
        {
            string userId = base.GetCuurentUserId();
            DataContext dbContext = new DataContext();

            var presentations = dbContext.GetPresentations(userId);

            return new JsonResult
            {
                Data = new { Presentations =  presentations },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                ContentType = "application/json"
            };
        }

        public ActionResult GetPresentation(string id)
        {
            DataContext dbContext = new DataContext();

            var presentation = dbContext.GetPresentation(id);

            return new JsonResult
            {
                Data = new { Presentation = presentation },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                ContentType = "application/json"
            };
        }


    }
}