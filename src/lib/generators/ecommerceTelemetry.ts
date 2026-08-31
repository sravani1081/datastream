// E-Commerce Synthetic Telemetry Generator

export interface ECommerceOrderRecord {
  order_id: string;
  user_id: string;
  sku: string;
  product_name: string;
  category: 'Electronics' | 'Apparel' | 'Home' | 'Beauty' | 'Sports';
  price_usd: number;
  quantity: number;
  payment_method: 'Credit Card' | 'PayPal' | 'Apple Pay' | 'Crypto';
  shipping_country: string;
  timestamp: string;
  is_fraud_flagged: boolean;
}

export class ECommerceTelemetryGenerator {
  private static pseudoRandom(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  static generateOrders(count = 100, seed = 42): ECommerceOrderRecord[] {
    const categories = ['Electronics', 'Apparel', 'Home', 'Beauty', 'Sports'] as const;
    const paymentMethods = ['Credit Card', 'PayPal', 'Apple Pay', 'Crypto'] as const;
    const countries = ['US', 'CA', 'UK', 'DE', 'JP', 'FR', 'AU'];

    return Array.from({ length: count }).map((_, i) => {
      const s = seed + i * 11;
      const catIdx = Math.floor(this.pseudoRandom(s) * categories.length);
      const payIdx = Math.floor(this.pseudoRandom(s + 1) * paymentMethods.length);
      const countryIdx = Math.floor(this.pseudoRandom(s + 2) * countries.length);
      const price = Math.floor(this.pseudoRandom(s + 3) * 450) + 15;
      const qty = Math.floor(this.pseudoRandom(s + 4) * 4) + 1;

      return {
        order_id: `ord_${10000 + i}`,
        user_id: `usr_${2000 + (i % 40)}`,
        sku: `SKU-${100 + (i % 20)}`,
        product_name: `Product ${categories[catIdx]} #${(i % 20) + 1}`,
        category: categories[catIdx],
        price_usd: price,
        quantity: qty,
        payment_method: paymentMethods[payIdx],
        shipping_country: countries[countryIdx],
        timestamp: new Date(Date.now() - i * 45000).toISOString(),
        is_fraud_flagged: price > 400 && paymentMethods[payIdx] === 'Crypto',
      };
    });
  }
}
