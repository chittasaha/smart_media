using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SmartMedia.Startup))]
namespace SmartMedia
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
