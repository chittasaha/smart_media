using System.Web;
using System.Web.Optimization;

namespace SmartMedia
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-1.10.2.min.js",
                        "~/Scripts/jquery-ui-1.10.3.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                      "~/Scripts/angular.min.js"));//,
                      //"~/Scripts/angular-sanitize.js"));
            
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.min.js",
                      "~/Scripts/designer/js/lib/ui-bootstrap-tpls-0.11.0.min.js",
                      //"~/Scripts/designer/js/lib/ui-bootstrap-0.7.0.min",
                      "~/Scripts/designer/js/modules/bootstrap-colorpicker-module.js"
                      ));

            bundles.Add(new StyleBundle("~/Content/siteCss").Include(
                      "~/Content/bootstrap.min.css",
                      //"~/Content/site.css",
                      "~/Content/font-awesome.css"));

            bundles.Add(new StyleBundle("~/Content/designerCss").Include(                      
                      "~/theme/aristo/Aristo.css",
                      "~/Content/colorpicker.css",
                      "~/Content/designer.css"));


            bundles.Add(new ScriptBundle("~/bundles/designer").Include(
                      "~/Scripts/designer/js/lib/mootools-core-1.4.5-full-nocompat-yc.js",
                      "~/Scripts/designer/js/shared/model/model.js",
                      "~/Scripts/designer/js/modules/designer.js"
                      //"~/Scripts/designer/js/modules/customDirectives.js"
                      //"~/Scripts/designer/js/lib/textAngular-sanitize.min.js"
                      //"~/Scripts/designer/js/lib/textAngular.min.js"
                      ));


        }
    }
}
