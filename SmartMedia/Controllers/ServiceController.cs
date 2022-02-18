using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Xml;

namespace SmartMedia.Controllers
{
    public class ServiceController : Controller
    {
        // GET: api
        public async Task<ActionResult> GetFeedContent(string url)
        {
            WebClient httpClient = new WebClient();
            var content = await httpClient.DownloadStringTaskAsync(new Uri(url));
            content = content.Replace("media:thumbnail", "thumbnail");
            content = content.Replace("@url", "url");
            content = content.Replace("$.url", "url");
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(content);
            //StringBuilder sb = new StringBuilder();
            //new JavaScriptSerializer().Serialize(doc.DocumentElement, sb);
            string json = JsonConvert.SerializeXmlNode(doc.DocumentElement);
            json = json.Replace("@url", "url");
            var result = new JsonResult()
            {
                Data = json,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
            return result;            
        }

       

        
    }
}