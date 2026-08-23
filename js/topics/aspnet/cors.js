export default {
  difficulty: 'intermediate',
  tagline: "CORS lets browsers call your API from a different origin — you control which ones.",
  explanation: `
    <p>The browser's same-origin policy blocks JavaScript from making requests to a different origin (scheme + host + port). CORS is the W3C mechanism that lets a server explicitly permit cross-origin requests by including specific response headers. Without CORS, your React/Vue/Angular frontend hosted on <code>app.example.com</code> cannot call your API on <code>api.example.com</code>.</p>
    <p>Before state-changing requests (POST, PUT, DELETE) the browser sends a <strong>preflight</strong> OPTIONS request. Your API must respond with the correct <code>Access-Control-Allow-*</code> headers or the browser blocks the actual request. ASP.NET Core's CORS middleware handles all of this automatically once you configure policies.</p>
  `,
  keyPoints: [
    'UseCors() must be placed after UseRouting() and before UseAuthorization()',
    'Named policies let you apply different CORS rules to different endpoints',
    'AllowAnyOrigin() cannot be combined with AllowCredentials() — browser security rule',
    'Preflight (OPTIONS) requests are automatic — ASP.NET Core responds to them for you',
    'WithExposedHeaders() is required for clients to read custom response headers via JS',
  ],
  code: `// Program.cs
builder.Services.AddCors(options => {
    // Permissive dev policy
    options.AddPolicy("DevPolicy", policy => policy
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

    // Strict production policy
    options.AddPolicy("ProductionPolicy", policy => policy
        .WithOrigins("https://app.example.com", "https://admin.example.com")
        .WithMethods("GET", "POST", "PUT", "DELETE")
        .WithHeaders("Content-Type", "Authorization")
        .AllowCredentials()               // Enables cookies/auth headers
        .WithExposedHeaders("X-Total-Count")); // JS can read this header
});

// Apply globally
app.UseCors("ProductionPolicy");

// Or per-controller/endpoint
[EnableCors("DevPolicy")]
[ApiController]
[Route("api/[controller]")]
public class PublicController : ControllerBase { ... }

// Or via Minimal API
app.MapGet("/public", () => "hello")
   .RequireCors("DevPolicy");`,
  output: `// Preflight OPTIONS /api/products:
// Access-Control-Allow-Origin: https://app.example.com
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE
// Access-Control-Allow-Headers: Content-Type, Authorization
// → browser proceeds with actual request`,
  prerequisites: ['middleware', 'controllers'],
  mistakes: [
    'Combining AllowAnyOrigin() with AllowCredentials() — browsers reject this combination',
    'Placing UseCors() after UseAuthorization() — auth runs before CORS, preflight gets 401',
    'Using wildcard origins in production — exposes your API to all web pages',
    'Forgetting that CORS is enforced by the browser, not the server — direct API calls (curl, Postman) bypass it',
  ],
  related: ['middleware', 'authentication', 'controllers'],
  interviewQ: 'Why can\'t you combine <code>AllowAnyOrigin()</code> with <code>AllowCredentials()</code>?',
  interviewA: 'The browser refuses this combination as a security measure. If a server allowed credentials (cookies, auth headers) from any origin, a malicious website could make authenticated requests to your API using the visitor\'s credentials — a classic CSRF-via-CORS attack. The browser requires you to explicitly name the allowed origins when credentials are involved, ensuring only trusted domains can send authenticated cross-origin requests.',
  whyItMatters: 'CORS errors are among the most common blockers for frontend developers integrating a new API. Understanding what CORS is, why it exists, and how to configure it correctly gets features unblocked quickly and prevents the security mistake of opening your API to all origins in production.',
};
