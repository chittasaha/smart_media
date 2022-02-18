using MongoDB.Bson;
using SmartMedia.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmartMedia.Models.ViewModel
{
    public class PresentationViewModel : PresentationBase
    {

        public string id { get; set; }
        
        public PresentationViewModel() { 
            
        }

        public PresentationViewModel(Presentation presentation)
        {
            this.id = presentation.Id.ToString();
            this.currentPageIndex = presentation.currentPageIndex;
            this.height = presentation.height;
            this.width = presentation.width;
            this.name = presentation.name;
            this.pageDuration = presentation.pageDuration;
            this.pages = presentation.pages;
            this.tickers = presentation.tickers;       
     
        }

        public Presentation Convert() {
            
            var prs = new Presentation();
            prs.name = this.name;
            prs.height = this.height;
            prs.pageDuration = this.pageDuration;
            prs.pages = this.pages;
            prs.tickers = this.tickers;
            prs.userId = this.userId;
            prs.width = this.width;
            prs.currentPageIndex = this.currentPageIndex;

            if (!string.IsNullOrEmpty(this.id)) {
                prs.Id = ObjectId.Parse(this.id);
            }

            return prs;
        }


    }
}