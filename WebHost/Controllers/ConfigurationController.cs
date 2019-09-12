using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Xls2Json.WebHost.Controllers
{
    /// <summary>
    /// Provides cofniguration.
    /// </summary>
    [Route("api/configuration")]
    [ApiController]
    [Produces("text/javascript")]
    public class ConfigurationController : ControllerBase
    {
        private readonly IHostingEnvironment environment;

        /// <summary>
        /// Creates new instance of <see cref="ConfigurationController"/>
        /// </summary>
        /// <param name="environment"></param>
        public ConfigurationController(IHostingEnvironment environment)
            => this.environment = environment ?? throw new ArgumentNullException(nameof(environment));

        /// <summary>
        /// Gets application configuration.
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        [HttpGet("{fileName}")]
        public ActionResult<object> Get(string fileName)
        {
            object configurationObject = new { this.environment.EnvironmentName };
            string configurationString = JsonConvert.SerializeObject(
                    configurationObject,
                    this.environment.IsDevelopment() ? Formatting.Indented : Formatting.None,
                    new JsonSerializerSettings()
                    {
                        Converters = new List<JsonConverter>() { new StringEnumConverter() }
                    }
                );
            return this.File(Encoding.UTF8.GetBytes($"var APP_CONFIG = {configurationString}"), "text/javascript");
        }
    }
}