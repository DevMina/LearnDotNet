export default {
  difficulty: 'beginner',
  versionLabel: '.NET 9+',
  tagline: "Auto-generate an OpenAPI document from your endpoints — explore it with Scalar or Swagger UI.",
  explanation: `
    <p>OpenAPI (formerly Swagger) is a standard JSON/YAML description of your API's endpoints, parameters, request bodies, and responses. .NET 9 ships a built-in OpenAPI package (<code>Microsoft.AspNetCore.OpenApi</code>) that generates this document automatically from your route registrations, <code>ActionResult&lt;T&gt;</code> return types, and XML doc comments.</p>
    <p>The generated document can be consumed by UI tools (Scalar, Swagger UI), code generators (NSwag, Kiota), and contract-testing tools — giving frontend teams, external consumers, and API clients an always-accurate description of your API without manual maintenance.</p>
  `,
  keyPoints: [
    'AddOpenApi() + MapOpenApi() registers the document endpoint at /openapi/v1.json',
    'Return typed ActionResult<T> or TypedResults so the schema is inferred correctly',
    'XML doc comments (///) populate summary/description in the document',
    '.WithSummary() and .WithDescription() add metadata to Minimal API endpoints',
    '[ProducesResponseType] documents non-default response codes (404, 422, etc.)',
  ],
  code: `// Program.cs (.NET 9)
builder.Services.AddOpenApi();

app.MapOpenApi(); // Serves /openapi/v1.json

// Optional: add Scalar UI (NuGet: Scalar.AspNetCore)
app.MapScalarApiReference();

// Controller endpoint — return type infers schema
/// <summary>Get a product by ID.</summary>
/// <param name="id">The product identifier.</param>
/// <response code="200">Returns the product.</response>
/// <response code="404">Product not found.</response>
[HttpGet("{id:int}")]
[ProducesResponseType<Product>(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<ActionResult<Product>> GetById(int id) { ... }

// Minimal API — chain metadata
app.MapGet("/products/{id:int}", async (int id, IProductRepo repo) => {
    var p = await repo.GetByIdAsync(id);
    return p is null ? Results.NotFound() : Results.Ok(p);
})
.WithName("GetProductById")
.WithSummary("Get a product by ID")
.WithDescription("Returns a single product or 404 if not found.")
.Produces<Product>()
.Produces(404);`,
  output: `// /openapi/v1.json (excerpt)
// {
//   "paths": {
//     "/api/products/{id}": {
//       "get": {
//         "summary": "Get a product by ID",
//         "responses": {
//           "200": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Product" } } } },
//           "404": { "description": "Not Found" }
//         }
//       }
//     }
//   }
// }`,
  prerequisites: ['controllers', 'minimal-apis'],
  mistakes: [
    'Returning IActionResult instead of ActionResult<T> — the response schema becomes unknown',
    'Not documenting non-200 responses — clients see only success cases in the generated spec',
    'Using Swashbuckle instead of the built-in package in .NET 9+ projects — AddOpenApi() is now the recommended path',
    'Skipping XML doc comments — the document is generated but lacks descriptions',
  ],
  related: ['controllers', 'minimal-apis', 'model-validation'],
  interviewQ: 'How do you ensure a Minimal API endpoint\'s response schema appears correctly in the OpenAPI document?',
  interviewA: 'Use <code>TypedResults</code> instead of <code>Results</code> — <code>TypedResults.Ok(product)</code> carries the type at compile time so the OpenAPI generator can infer the schema. Chain <code>.Produces&lt;T&gt;()</code> to document the response type explicitly, and <code>.ProducesProblem(404)</code> for error responses. Without these, the generator sees <code>IResult</code> and cannot determine the response body schema.',
  whyItMatters: 'An accurate, auto-maintained OpenAPI document eliminates an entire category of communication overhead between backend and frontend teams. Frontend developers can generate type-safe API clients from the document, and the spec serves as a living contract that is always in sync with the actual implementation.',
};
