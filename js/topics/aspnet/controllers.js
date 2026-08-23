export default {
  difficulty: 'intermediate',
  tagline: "Controllers route HTTP requests to action methods and return structured responses.",
  explanation: `
    <p>A controller is a class that groups related HTTP endpoints. In ASP.NET Core MVC/Web API, any class decorated with <code>[ApiController]</code> and inheriting <code>ControllerBase</code> (no view support) or <code>Controller</code> (adds view helpers) is a controller. Routing attributes on the class and methods map URLs to action methods.</p>
    <p><code>[ApiController]</code> adds three behaviours automatically: attribute routing is required, invalid <code>ModelState</code> returns a 400 ProblemDetails response without you checking it, and binding source parameters are inferred (<code>[FromBody]</code>, <code>[FromRoute]</code>, etc.).</p>
  `,
  keyPoints: [
    'ControllerBase for APIs (no views); Controller for MVC with Razor views',
    '[ApiController] auto-validates ModelState and infers binding sources',
    'Return IActionResult or ActionResult<T> — the latter preserves the type for OpenAPI',
    'Route template on class ([Route("api/[controller]")]) combines with method-level routes',
    'Use typed results (Ok(), Created(), NotFound(), BadRequest()) for clarity',
  ],
  code: `[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase {
    private readonly IProductRepository _repo;

    public ProductsController(IProductRepository repo) => _repo = repo;

    // GET api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll() {
        var products = await _repo.GetAllAsync();
        return Ok(products);
    }

    // GET api/products/42
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id) {
        var product = await _repo.GetByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    // POST api/products
    [HttpPost]
    public async Task<ActionResult<Product>> Create(CreateProductDto dto) {
        var product = await _repo.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    // DELETE api/products/42
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id) {
        var deleted = await _repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}`,
  output: `// HTTP responses:
// GET /api/products       → 200 OK  [array of products]
// GET /api/products/42    → 200 OK  {product} or 404 Not Found
// POST /api/products      → 201 Created {product}
// DELETE /api/products/42 → 204 No Content or 404 Not Found`,
  prerequisites: ['dependency-injection', 'async-await', 'middleware'],
  mistakes: [
    'Inheriting Controller instead of ControllerBase for API-only controllers — adds unnecessary view overhead',
    'Returning the raw object without Ok() — still works but loses ActionResult flexibility',
    'Not using [ApiController] — you must manually check ModelState.IsValid',
    'Putting business logic in controllers — they should only orchestrate, not implement rules',
  ],
  related: ['model-binding', 'model-validation', 'middleware', 'minimal-apis'],
  interviewQ: 'What does the <code>[ApiController]</code> attribute add to a controller?',
  interviewA: 'Three automatic behaviours: (1) attribute routing becomes required — convention-based routing is disabled; (2) model validation is automatic — if <code>ModelState.IsValid</code> is false, a 400 ProblemDetails response is returned before your action executes; (3) binding sources are inferred — complex types from the body, simple types from the route or query string, without needing explicit <code>[FromBody]</code>/<code>[FromQuery]</code> attributes on every parameter.',
  whyItMatters: 'Controllers are the entry point of every MVC and Web API request. Understanding their routing, binding, and response patterns is the foundation for building correct, well-structured HTTP APIs — and knowing when to prefer Minimal APIs instead.',
};
