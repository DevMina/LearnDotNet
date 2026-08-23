export default {
  tagline: "Authentication proves who you are; authorization decides what you can do.",
  explanation: `
          <p><strong>Authentication</strong> in ASP.NET Core establishes the user's identity — who is making the request. <strong>Authorization</strong> uses that identity to decide whether the request is permitted. The two are always separate: you authenticate first, then authorize. Both are added as middleware in the pipeline, and order matters — <em>UseAuthentication</em> must come before <em>UseAuthorization</em>.</p>
          <p>The <em>[Authorize]</em> attribute (or <em>RequireAuthorization()</em> in Minimal APIs) protects endpoints. Policies let you express complex rules — role checks, claim requirements, or custom logic — in one named unit rather than scattering conditions across your code.</p>
        `,
  keyPoints: [
    "UseAuthentication() and UseAuthorization() must be added in that order",
    "[Authorize] protects a controller or endpoint; [AllowAnonymous] opens it back up",
    "Policies group authorization rules by name, applied via RequireAuthorization(\"PolicyName\")"
  ],
  code: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly",
        p => p.RequireRole("Admin"));
});

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/public", () => "Anyone can see this");
app.MapGet("/admin", () => "Admins only")
   .RequireAuthorization("AdminOnly");

app.Run();`,
  output: `GET /public  → 200 OK
GET /admin   → 401 Unauthorized (unauthenticated)
             → 403 Forbidden (authenticated, wrong role)`,
  related: ["jwt", "middleware"],
  mistakes: [
      "Calling UseAuthorization before UseAuthentication \u2014 authentication must run first to populate the user",
      "Using [Authorize] without configuring an authentication scheme \u2014 results in a silent 401",
      "Storing sensitive claims in the JWT payload \u2014 it's signed, not encrypted; anyone can decode it"
  ],

  difficulty: 'advanced',

  interviewQ: `What is the difference between authentication and authorisation?`,

  interviewA: `Authentication answers "who are you?" — it verifies identity using credentials (password, JWT, cookie, API key). Authorisation answers "what are you allowed to do?" — it checks whether the authenticated identity has permission for a specific action. In ASP.NET Core, <code>UseAuthentication()</code> must come before <code>UseAuthorization()</code> in the middleware pipeline because authorisation needs a populated <code>ClaimsPrincipal</code> to evaluate policies. A request with a valid JWT but insufficient role claims fails authorisation, not authentication.`,

  whyItMatters: `Getting authentication and authorisation wrong is a critical security vulnerability. Understanding the pipeline order, claims-based identity, and policy-based authorisation is mandatory for anyone building a public-facing API.`,

  prerequisites: ["middleware","jwt"],
};
