export default {
  tagline: "Stateless, self-contained tokens for authenticating API requests.",
  explanation: `
          <p>A <strong>JSON Web Token (JWT)</strong> is a compact, URL-safe string carrying claims — assertions about a user, like their id or roles — that are cryptographically signed so a server can verify them without hitting a database. It has three base64-encoded parts separated by dots: <em>header</em> (algorithm), <em>payload</em> (claims), and <em>signature</em>.</p>
          <p>In ASP.NET Core, the <em>AddJwtBearer</em> extension registers middleware that reads the <em>Authorization: Bearer &lt;token&gt;</em> header, validates the signature and expiry against your configured options, and populates <em>HttpContext.User</em> with the token's claims — making them available to authorization policies and your own code.</p>
        `,
  keyPoints: [
    "JWTs are signed, not encrypted — never put secrets in the payload",
    "Validate issuer, audience, and expiry — all three matter for real security",
    "Short expiry (15 min) + refresh tokens is the standard production pattern"
  ],
  code: `using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes("super-secret-key-min-32-chars!!"));

var token = new JwtSecurityToken(
    issuer: "myapp",
    audience: "myapp",
    claims: new[] { new Claim("name", "Mina"), new Claim("role", "Admin") },
    expires: DateTime.UtcNow.AddMinutes(15),
    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
);

var jwt = new JwtSecurityTokenHandler().WriteToken(token);
Console.WriteLine(jwt[..40] + "...");`,
  output: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJu...`,
  related: ["authentication", "middleware"],
  mistakes: [
      "Using a short, weak signing key \u2014 HMAC-SHA256 requires at least 256 bits (32 bytes) of key material",
      "Not validating the audience and issuer \u2014 accepting tokens from any issuer defeats token security",
      "Never refreshing tokens \u2014 long-lived JWTs are a security risk; use short expiry plus refresh tokens"
  ]
};
