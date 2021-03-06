﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Xls2Json.WebHost
{
    /// <summary>
    /// The start up logic.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="configuration"></param>
        public Startup(IConfiguration configuration)
            => this.Configuration = configuration;

        /// <summary>
        /// App configuration
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        ///  This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddMvc();
            services.AddControllers()
                .AddNewtonsoftJson();
            services.AddHealthChecks();
            //services.AddSwaggerGen(c =>
            //{
            //    c.DescribeAllEnumsAsStrings();
            //    c.DescribeAllParametersInCamelCase();
            //    c.SwaggerDoc("v1",
            //        new Info
            //        {
            //            Title = "Xls2Json API",
            //            Version = "v1",
            //            Contact = new Contact()
            //            {
            //                Email = "valensm@seznam.cz",
            //                Name = "Martin Valenský"
            //            }
            //        });
            //    c.IncludeXmlComments(
            //            Path.Combine(
            //                    AppContext.BaseDirectory,
            //                    $"{this.GetType().Assembly.GetName().Name}.xml"
            //                )
            //        );
            //});
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            //app.UseSwagger();
            //app.UseSwaggerUI(c =>
            //{
            //    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Xls2Json API v1");
            //    c.RoutePrefix = "api";
            //});
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/health");
                endpoints.MapControllers();
            });
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "convert-app";
                if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:5005");
                }
            });
        }
    }
}