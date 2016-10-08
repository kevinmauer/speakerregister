﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4.Models;
using IdentityServer4.Services.InMemory;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace sregister_sec
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddIdentityServer()
                .AddInMemoryStores()
                .AddInMemoryClients(Clients.Get())
                .AddInMemoryScopes(Scopes.Get())
                .AddInMemoryUsers(Users.Get())
                .SetTemporarySigningCredential();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseIdentityServer();

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Hello World from sregister_sec!");
            });
        }
    }

    internal class Clients
    {
        public static IEnumerable<Client> Get()
        {
            return new List<Client> {
                new Client {
                    ClientId = "oauthClient",
                    ClientName = "Example Client Credentials Client Application",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets = new List<Secret> {
                        new Secret("superSecretPassword".Sha256())},
                    AllowedScopes = new List<string> {"customAPI"}
                }
            };
        }
    }

    internal class Scopes
    {
        public static IEnumerable<Scope> Get()
        {
            return new List<Scope> {
                StandardScopes.OpenId,
                StandardScopes.Profile,
                StandardScopes.Email,
                StandardScopes.Roles,
                StandardScopes.OfflineAccess,
                new Scope {
                    Name = "customAPI",
                    DisplayName = "Custom API",
                    Description = "Custom API scope",
                    Type = ScopeType.Resource,
                    Claims = new List<ScopeClaim> {
                        new ScopeClaim(JwtClaimTypes.Role)
                    },
                    ScopeSecrets =  new List<Secret> {
                        new Secret("scopeSecret".Sha256())
                    }
                }
            };
        }
    }

    internal class Users
    {
        public static List<InMemoryUser> Get()
        {
            return new List<InMemoryUser> {
                new InMemoryUser {
                    Subject = "5BE86359-073C-434B-AD2D-A3932222DABE",
                    Username = "richard",
                    Password = "password",
                    Claims = new List<Claim> {
                        new Claim(JwtClaimTypes.Email, "rtaylor@rightincode.com"),
                        new Claim(JwtClaimTypes.Role, "SuperMan")
                    }
                }
            };
        }
    }
}
