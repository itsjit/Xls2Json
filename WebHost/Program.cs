using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace Xls2Json.WebHost
{
    /// <summary>
    /// Entry point for whole app.
    /// </summary>
    public static class Program
    {
        /// <summary>
        /// The entry point method.
        /// </summary>
        /// <param name="args"></param>
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        /// <summary>
        /// Creates web host builder.
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
            => Microsoft.AspNetCore.WebHost
                .CreateDefaultBuilder(args)
                .ConfigureLogging(builder =>
                        builder.AddAzureWebAppDiagnostics()
                    )
                .UseStartup<Startup>();
    }
}