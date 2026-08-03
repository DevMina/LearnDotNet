export default {
  tagline: "One-to-many notification without tight coupling.",
  explanation: `
          <p>The <strong>Observer</strong> pattern lets one object (the subject) notify many dependent objects (observers) when its state changes, without the subject knowing anything concrete about them. C#'s built-in <strong>event</strong> keyword is a direct, language-level implementation of this pattern.</p>
          <p>This decouples the source of a change from whatever needs to react to it — the publisher never needs a reference to the subscriber's type.</p>
        `,
  keyPoints: [
  "The subject holds no reference to concrete observer types, only the event",
  "C# events are effectively Observer built into the language",
  "Any number of observers can subscribe or unsubscribe at runtime"
],
  code: `public class StockTicker
{
    public event Action<decimal>? PriceChanged;
    public void UpdatePrice(decimal price) => PriceChanged?.Invoke(price);
}

var ticker = new StockTicker();
ticker.PriceChanged += p => Console.WriteLine($"Dashboard sees: {p:C}");
ticker.PriceChanged += p => Console.WriteLine($"Alert service sees: {p:C}");

ticker.UpdatePrice(142.50m);`,
  output: `Dashboard sees: $142.50
Alert service sees: $142.50`
};
