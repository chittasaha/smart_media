using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartMedia.Core.Models;
using System.Collections;
using System.Collections.Generic;

namespace SmartMediaTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            Presentation pr = new Presentation();
            pr.name = "";

            Page pg = new Page();
            //pg.items = new List<MediaBase>();
            
            //Image im = new Image();
            //im.height = 100;
            //im.width = 200;

            //pg.items.Add(im);

            pr.pages = new List<Page>();

            pr.pages.Add(pg);

            Assert.AreEqual(1, pr.pages.Count);

        }
    }
}
