using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace WebHost.Controllers
{
    public class HomeController : Controller
    {
        private Dictionary<string, string> settings;

        public HomeController(IConfiguration configuration)
        {
            this.settings = configuration.GetChildren().ToDictionary(a => a.Key, a => a.Value);
        }

        public IActionResult Index()
            => this.View();
    }
}