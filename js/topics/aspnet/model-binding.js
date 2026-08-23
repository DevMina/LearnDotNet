export default {
  difficulty: 'intermediate',
  tagline: "ASP.NET Core automatically maps HTTP request data to action parameters.",
  explanation: `
    <p>Model binding reads data from the HTTP request and populates action method parameters and properties. By default it searches in order: <strong>route values</strong> → <strong>query string</strong> → <strong>request body</strong>. With <code>[ApiController]</code>, complex types default to <code>[FromBody]</code> and simple types default to <code>[FromRoute]</code> or <code>[FromQuery]</code>.</p>
    <p>Explicit binding source attributes let you override the default: <code>[FromBody]</code> reads JSON from the body (one per action), <code>[FromQuery]</code> reads from the URL query string, <code>[FromRoute]</code> reads from route segments, <code>[FromHeader]</code> reads from HTTP headers, and <code>[FromForm]</code> reads from multipart/form-data.</p>
  `,
  keyPoints: [
    '[FromBody] reads JSON/XML request body — only one [FromBody] per action',
    '[FromQuery] binds query string parameters: /products?page=2&size=10',
    '[FromRoute] binds route segments: /products/{id}',
    '[FromHeader] binds HTTP headers: useful for API keys, correlation IDs',
    'Custom model binders let you bind from non-standard sources or transform values',
  ],
  code: `[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase {

    // Route + query string binding
    // GET api/orders/123?includeItems=true
    [HttpGet("{id:int}")]
    public Task<Order> Get(
        [FromRoute] int id,
        [FromQuery] bool includeItems = false) { ... }

    // Body binding — JSON deserialized automatically
    // POST api/orders   Body: {"customerId":5,"items":[...]}
    [HttpPost]
    public Task<Order> Create([FromBody] CreateOrderDto dto) { ... }

    // Header binding — e.g. API key or idempotency key
    // POST api/orders   Header: Idempotency-Key: abc-123
    [HttpPost("idempotent")]
    public Task<Order> CreateIdempotent(
        [FromBody] CreateOrderDto dto,
        [FromHeader(Name = "Idempotency-Key")] string key) { ... }

    // Mixed — route + body + query
    // PUT api/orders/42?notify=true   Body: { "status": "shipped" }
    [HttpPut("{id:int}")]
    public Task<Order> Update(
        [FromRoute] int id,
        [FromBody] UpdateOrderDto dto,
        [FromQuery] bool notify = false) { ... }
}`,
  output: `// Model binding is transparent — ASP.NET Core populates parameters
// before your action method body executes.
// If binding fails (wrong type, missing required value), [ApiController]
// returns 400 Bad Request automatically.`,
  prerequisites: ['controllers', 'async-await'],
  mistakes: [
    'Using two [FromBody] parameters — only one body can be read per request',
    'Binding a complex type from query string without a custom binder — only primitives bind from query by default',
    'Forgetting [FromBody] on non-[ApiController] controllers — complex types do not auto-bind from body',
    'Expecting null-safety — model binding sets missing optional parameters to their default value, not null',
  ],
  related: ['controllers', 'model-validation', 'minimal-apis'],
  interviewQ: 'What is the order of precedence when model binding has no explicit source attribute?',
  interviewA: 'Without <code>[ApiController]</code>: route values → query string → form fields → body. With <code>[ApiController]</code>, the inference is smarter: complex types are assumed to come from the body (<code>[FromBody]</code> inferred), and simple types (int, string, Guid) are assumed to come from the route if there is a matching route parameter, otherwise from the query string. You can always override with explicit attributes.',
  whyItMatters: 'Model binding is the glue between HTTP and your C# types. When it works correctly you never write manual parsing code. When it fails silently, you get unexpected nulls or 400 errors with no clear cause. Understanding the binding sources and precedence turns mysterious binding failures into quick fixes.',
};
