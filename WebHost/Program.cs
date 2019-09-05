using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace Xls2Json.WebHost
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
            => Microsoft.AspNetCore.WebHost
                .CreateDefaultBuilder(args)
                .ConfigureLogging(builder =>
                        builder.AddAzureWebAppDiagnostics()
                    )
                .UseStartup<Startup>();
    }
}