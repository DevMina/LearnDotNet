export default {
  difficulty: 'intermediate',
  tagline: "Data annotations and ModelState validate inputs declaratively before your action runs.",
  explanation: `
    <p>Model validation checks that incoming data meets your requirements before your action method executes. Add data annotation attributes to your DTO properties and ASP.NET Core validates them automatically. With <code>[ApiController]</code>, invalid models return a 400 ProblemDetails response before your action body runs — no <code>if (!ModelState.IsValid)</code> needed.</p>
    <p>For complex business rules that annotations cannot express, implement <code>IValidatableObject</code> on the DTO, or use a dedicated validation library like FluentValidation that integrates with the same pipeline.</p>
  `,
  keyPoints: [
    '[Required] rejects null/empty; [Range] enforces numeric bounds; [StringLength] limits string length',
    '[EmailAddress], [Phone], [Url] validate format with built-in regex',
    '[ApiController] auto-returns 400 ValidationProblemDetails on invalid ModelState',
    'IValidatableObject.Validate() handles cross-property rules that annotations cannot express',
    'Custom ValidationAttribute lets you write reusable, attribute-based rules',
  ],
  code: `// DTO with validation annotations
public class CreateProductDto {
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Range(0.01, 100_000, ErrorMessage = "Price must be between 0.01 and 100,000")]
    public decimal Price { get; set; }

    [Required]
    [EnumDataType(typeof(ProductCategory))]
    public ProductCategory Category { get; set; }
}

// Controller — no ModelState check needed with [ApiController]
[HttpPost]
public async Task<ActionResult<Product>> Create(CreateProductDto dto) {
    // If dto is invalid, ASP.NET Core already returned 400 before reaching here
    var product = await _repo.CreateAsync(dto);
    return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
}

// IValidatableObject for cross-property rules
public class DateRangeDto : IValidatableObject {
    public DateTime Start { get; set; }
    public DateTime End { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext ctx) {
        if (End <= Start)
            yield return new ValidationResult("End must be after Start",
                new[] { nameof(End) });
    }
}`,
  output: `// Invalid request body:
// POST /api/products {"name":"","price":-5}
//
// 400 Bad Request:
// {
//   "errors": {
//     "Name": ["Name is required"],
//     "Price": ["Price must be between 0.01 and 100,000"]
//   }
// }`,
  prerequisites: ['controllers', 'model-binding'],
  mistakes: [
    'Checking ModelState.IsValid manually in [ApiController] controllers — it is already handled',
    'Using [Required] on value types (int, bool) — they are never null; use [Range] instead',
    'Validating only at the API layer — always re-validate in the domain when data comes from untrusted sources',
    'Over-using annotations for complex business rules — IValidatableObject or FluentValidation is cleaner',
  ],
  related: ['controllers', 'model-binding', 'exception-handling'],
  interviewQ: 'How would you validate that two properties on a request DTO are consistent with each other?',
  interviewA: 'Implement <code>IValidatableObject</code> on the DTO. Its <code>Validate()</code> method runs after all individual property annotations pass, receives a <code>ValidationContext</code>, and can yield any number of <code>ValidationResult</code> objects referencing one or more property names. For more complex or reusable validation logic, FluentValidation is a popular library that integrates with the ASP.NET Core pipeline and produces the same <code>ValidationProblemDetails</code> response format.',
  whyItMatters: 'Validation at the API boundary is the first line of defence against bad data. Catching invalid inputs before they reach the database or business logic prevents data corruption, reduces bug reports, and produces actionable error messages that clients can display to users.',
};
