using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http.ModelBinding;
using System.Web.Script.Serialization;

using Newtonsoft.Json;
using SmartMedia.Core.Models;


namespace SmartMedia.ModelBinder
{
    public class JSONModelBinder : System.Web.Mvc.IModelBinder
    {
        

        public object BindModel(System.Web.Mvc.ControllerContext controllerContext, System.Web.Mvc.ModelBindingContext bindingContext)
        {

            string mName = bindingContext.ModelName;

            var inputStream = controllerContext.HttpContext.Request.InputStream;

            controllerContext.HttpContext.Request.InputStream.Position = 0;

            StreamReader reader = new StreamReader(controllerContext.HttpContext.Request.InputStream);
            string bodyText = reader.ReadToEnd();
            if (String.IsNullOrEmpty(bodyText))
            {
                // no JSON data
                return null;
            }


            //dynamic data = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(bodyText);


            //Presentation prs = new Presentation();
            //prs.height = data.height;
            //prs.width = data.width;
            //prs.pageDuration = data.pageDuration;
            //prs.tickers = data.tickers;
            
            //var prs = Newtonsoft.Json.JsonConvert.DeserializeObject<Presentation>(bodyText);

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue; //increase MaxJsonLength.  This could be read in from the web.config if you prefer
            Dictionary<string, object> jsonData = (serializer.DeserializeObject(bodyText) as Dictionary<string, object>)["presentation"] as Dictionary<string, object>;

            foreach (string key in jsonData.Keys)
            {
                if (key == "caller") {
                    continue;
                }

                string value = jsonData[key].ToString();
            }
            
            var model = bindingContext.Model;

            return model;
        }
    }
}